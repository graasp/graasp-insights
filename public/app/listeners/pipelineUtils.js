const fs = require('fs');
const path = require('path');
const ObjectId = require('bson-objectid');
const logger = require('../logger');

const { DATASETS_FOLDER } = require('../config/paths');
const {
  EXECUTE_PIPELINE_CHANNEL,
  buildExecuteAlgorithmChannel,
} = require('../../shared/channels');
const {
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_ALGORITHM_STOP,
  EXECUTE_PIPELINE_SUCCESS,
} = require('../../shared/types');
const {
  PROGRAMMING_LANGUAGES,
  DATASETS_COLLECTION,
  DATASET_TYPES,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  EXECUTION_STATUSES,
} = require('../../shared/constants');
const {
  ERROR_EXECUTION_PROCESS,
  ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
} = require('../../shared/errors');
const { createNewDataset } = require('./loadDataset');
const { cancelExecutionObject } = require('./cancelExecution');
const executePythonAlgorithm = require('./executePythonAlgorithm');

const createNewResultDataset = (
  { name, filepath, algorithmId, description },
  db,
) => {
  const result = createNewDataset(
    {
      name,
      filepath,
      description,
      type: DATASET_TYPES.RESULT,
    },
    db,
  );
  result.algorithmId = algorithmId;
  return result;
};

const addExecutionObject = (
  db,
  sourceId,
  algorithmId,
  userProvidedFilename,
  datasetName,
  algorithmName,
  parameters,
  schemaId,
) => {
  const execution = {
    id: ObjectId().str,
    algorithm: { id: algorithmId },
    source: { id: sourceId },
    executedAt: Date.now(),
    status: EXECUTION_STATUSES.PENDING,
    result: {
      name: userProvidedFilename || `${datasetName}_${algorithmName}`,
    },
    parameters,
    schemaId,
  };
  db.get(EXECUTIONS_COLLECTION).push(execution).write();
  return execution;
};

const getOnRunFunction = (db, executionId) => {
  // set execution as running and pid
  return ({ pid }) => {
    db.get(EXECUTIONS_COLLECTION)
      .find({ id: executionId })
      .assign({ status: EXECUTION_STATUSES.RUNNING, pid })
      .write();
  };
};

const getCleanFunction = (tmpPath) => {
  return () => {
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  };
};

const getOnStopFunction = (mainWindow, db, executionId, channel) => {
  return () => {
    cancelExecutionObject(db, executionId);

    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    return (
      !mainWindow.isDestroyed() &&
      mainWindow?.webContents?.send(channel, {
        type: EXECUTE_ALGORITHM_STOP,
      })
    );
  };
};

const getOnErrorFunction = (mainWindow, db, executionId, channel) => {
  // error handling when executing
  return ({ code, log }) => {
    logger.error(
      `process for execution ${executionId} exited with code ${code}`,
    );
    db.get(EXECUTIONS_COLLECTION)
      .find({ id: executionId })
      .assign({ status: EXECUTION_STATUSES.ERROR, log })
      .unset('pid')
      .value();

    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    return (
      !mainWindow.isDestroyed() &&
      mainWindow?.webContents?.send(channel, {
        type: EXECUTE_ALGORITHM_ERROR,
        error: ERROR_EXECUTION_PROCESS,
        log,
      })
    );
  };
};

const runAlgorithm = (
  mainWindow,
  language,
  algorithmFilepath,
  filepath,
  tmpPath,
  parameters,
  schemaId,
  onRun,
  onStop,
  onSuccess,
  onError,
  clean,
  channel,
) => {
  switch (language) {
    case PROGRAMMING_LANGUAGES.PYTHON:
      return executePythonAlgorithm(
        { algorithmFilepath, filepath, tmpPath, parameters, schemaId },
        { onRun, onStop, onSuccess, onError, clean },
      );

    default:
      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      return (
        !mainWindow.isDestroyed() &&
        mainWindow.webContents.send(channel, {
          type: EXECUTE_ALGORITHM_ERROR,
          error: ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
        })
      );
  }
};

const runPipelineAlgorithm = (
  mainWindow,
  db,
  algorithms,
  algorithm,
  sourceId,
  userProvidedFilename,
  parameters,
  schemaId,
  indexAlgorithm,
) => {
  const { name: datasetName } = db
    .get(DATASETS_COLLECTION)
    .find({ id: sourceId })
    .value();
  const { name: algorithmName } = db
    .get(ALGORITHMS_COLLECTION)
    .find({ id: algorithm.id })
    .value();
  let execution;
  if (indexAlgorithm + 1 === algorithms.length) {
    execution = addExecutionObject(
      db,
      sourceId,
      algorithm.id,
      userProvidedFilename,
      datasetName,
      algorithmName,
      db
        .get(ALGORITHMS_COLLECTION)
        .find(({ id }) => id === algorithm.id)
        .value()?.parameters || [],
      schemaId,
    );
  } else {
    const newProvidedFileName = `${userProvidedFilename}alg:${algorithm.id}idx:${indexAlgorithm}`;
    execution = addExecutionObject(
      db,
      sourceId,
      algorithm.id,
      newProvidedFileName,
      datasetName,
      algorithmName,
      db
        .get(ALGORITHMS_COLLECTION)
        .find(({ id }) => id === algorithm.id)
        .value()?.parameters || [],
      schemaId,
    );
  }

  const channel = buildExecuteAlgorithmChannel(execution.id);
  const { filepath, description } = db
    .get(DATASETS_COLLECTION)
    .find({ id: sourceId })
    .value();
  const { filepath: algorithmFilepath, language } = db
    .get(ALGORITHMS_COLLECTION)
    .find({ id: algorithm.id })
    .value();
  const tmpPath = path.join(DATASETS_FOLDER, `tmp_${execution.id}.json`);

  // prepare all callback functions
  const onRun = getOnRunFunction(db, execution.id);
  const onSuccess = ({ log }) => {
    // save result in db
    const newResult = createNewResultDataset(
      {
        name: execution.result.name?.length
          ? execution.result.name
          : `${datasetName}_${algorithmName}`,
        filepath: tmpPath,
        algorithmId: algorithm.id,
        description,
      },
      db,
    );
    db.get(DATASETS_COLLECTION).push(newResult).write();

    db.get(EXECUTIONS_COLLECTION)
      .find({ id: execution.id })
      .assign({
        status: EXECUTION_STATUSES.SUCCESS,
        result: { id: newResult.id },
        log,
      })
      .unset('pid')
      .write();

    logger.debug(`save resulting dataset at ${newResult.filepath}`);

    // no sure if still needed
    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    // !mainWindow.isDestroyed() &&
    //   mainWindow?.webContents?.send(channel, {
    //     type: EXECUTE_ALGORITHM_SUCCESS,
    //     payload: {
    //       execution: db
    //         .get(EXECUTIONS_COLLECTION)
    //         .find({ id: execution.id })
    //         .value(),
    //       result: newResult,
    //     },
    //   });

    // conditon to stop the following call
    if (indexAlgorithm + 1 < algorithms.length) {
      return runPipelineAlgorithm(
        mainWindow,
        db,
        algorithms,
        algorithms[indexAlgorithm + 1],
        newResult.id,
        userProvidedFilename,
        execution.parameters,
        schemaId,
        indexAlgorithm + 1,
      );
    }
    return mainWindow.webContents.send(EXECUTE_PIPELINE_CHANNEL, {
      type: EXECUTE_PIPELINE_SUCCESS,
    });
  };
  const clean = getCleanFunction(tmpPath);
  const onStop = getOnStopFunction(mainWindow, db, execution.id, channel);
  const onError = getOnErrorFunction(mainWindow, db, execution.id, channel);

  runAlgorithm(
    mainWindow,
    language,
    algorithmFilepath,
    filepath,
    tmpPath,
    execution.parameters,
    schemaId,
    onRun,
    onStop,
    onSuccess,
    onError,
    clean,
    channel,
  );
};

module.exports = runPipelineAlgorithm;
