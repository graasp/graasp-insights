const path = require('path');
const logger = require('../logger');

const { DATASETS_FOLDER } = require('../config/paths');
const {
  EXECUTE_PIPELINE_CHANNEL,
  buildExecuteAlgorithmChannel,
} = require('../../shared/channels');
const {
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_PIPELINE_SUCCESS,
} = require('../../shared/types');
const {
  PROGRAMMING_LANGUAGES,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  EXECUTION_STATUSES,
} = require('../../shared/constants');
const { ERROR_UNKNOWN_PROGRAMMING_LANGUAGE } = require('../../shared/errors');

const { addExecutionObject } = require('./createExecution');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const createNewResultDataset = require('../utils/result');
const {
  buildOnRunCallback,
  buildOnStopCallback,
  buildOnErrorCallback,
  buildCleanCallback,
  buildOnLogCallback,
} = require('../utils/execution');

const runAlgorithm = (
  mainWindow,
  channel,
  {
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
    onLog,
  },
) => {
  switch (language) {
    case PROGRAMMING_LANGUAGES.PYTHON:
      return executePythonAlgorithm(
        { algorithmFilepath, filepath, tmpPath, parameters, schemaId },
        { onRun, onStop, onSuccess, onError, clean, onLog },
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

const executePipelineAlgorithm = (
  mainWindow,
  db,
  { algorithms, sourceId, userProvidedFilename, schemaId, algorithmIndex },
) => {
  const algorithm = algorithms[algorithmIndex];
  const { name: datasetName } = db
    .get(DATASETS_COLLECTION)
    .find({ id: sourceId })
    .value();
  const { name: algorithmName } = db
    .get(ALGORITHMS_COLLECTION)
    .find({ id: algorithm.id })
    .value();

  // provide either the transient or final filename
  const newProvidedFileName =
    algorithmIndex + 1 === algorithms.length
      ? userProvidedFilename
      : `${userProvidedFilename}_${algorithmIndex}_${algorithm.id}`;

  const execution = addExecutionObject(db, {
    sourceId,
    algorithmId: algorithm.id,
    userProvidedFilename: newProvidedFileName,
    datasetName,
    algorithmName,
    parameters:
      db
        .get(ALGORITHMS_COLLECTION)
        .find(({ id }) => id === algorithm.id)
        .value()?.parameters || [],
    schemaId,
  });

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
  const onRun = buildOnRunCallback(db, { executionId: execution.id });

  // the onSuccess callback allows to run the next algorithm of the pipeline
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

    // continue running the pipeline by executing the next algorithm
    if (algorithmIndex + 1 < algorithms.length) {
      return executePipelineAlgorithm(mainWindow, db, {
        algorithms,
        sourceId: newResult.id,
        userProvidedFilename,
        schemaId,
        algorithmIndex: algorithmIndex + 1,
      });
    }

    // the whole pipeline is executed so we can return
    return mainWindow.webContents.send(EXECUTE_PIPELINE_CHANNEL, {
      type: EXECUTE_PIPELINE_SUCCESS,
    });
  };
  const clean = buildCleanCallback(tmpPath);
  const onStop = buildOnStopCallback(mainWindow, db, channel, {
    executionId: execution.id,
  });
  const onError = buildOnErrorCallback(mainWindow, db, channel, {
    executionId: execution.id,
  });
  const onLog = buildOnLogCallback(db, { executionId: execution.id });

  runAlgorithm(mainWindow, channel, {
    language,
    algorithmFilepath,
    filepath,
    tmpPath,
    parameters: execution.parameters,
    schemaId,
    onRun,
    onStop,
    onSuccess,
    onError,
    clean,
    onLog,
  });
};

module.exports = executePipelineAlgorithm;
