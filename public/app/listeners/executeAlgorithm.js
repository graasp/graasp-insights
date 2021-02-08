const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/paths');
const { createNewDataset } = require('./loadDataset');
const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
} = require('../db');
const { buildExecuteAlgorithmChannel } = require('../../shared/channels');
const {
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASET_TYPES,
} = require('../../shared/constants');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const {
  ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
  ERROR_EXECUTION_PROCESS,
  ERROR_GENERAL,
} = require('../../shared/errors');
const {
  EXECUTE_ALGORITHM_SUCCESS,
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_ALGORITHM_STOP,
} = require('../../shared/types');
const { cancelExecutionObject } = require('./cancelExecution');

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

const executeAlgorithm = (mainWindow, db) => (
  event,
  {
    id: executionId,
    source: { id: sourceId },
    algorithm: { id: algorithmId },
    result: { name },
    parameters,
    schemaId,
  },
) => {
  const channel = buildExecuteAlgorithmChannel(executionId);
  try {
    // get corresponding dataset
    const { filepath, name: datasetName, description } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();

    // get the corresponding algorithm
    const {
      filepath: algorithmFilepath,
      name: algorithmName,
      language,
    } = db.get(ALGORITHMS_COLLECTION).find({ id: algorithmId }).value();

    const tmpPath = path.join(DATASETS_FOLDER, `tmp_${executionId}.json`);

    // prepare onRun callback function
    // set execution as running and pid
    const onRun = ({ pid }) => {
      db.get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({ status: EXECUTION_STATUSES.RUNNING, pid })
        .write();
    };

    // prepare success callback function
    // copy tmp as new result dataset
    // update execution and return it
    const onSuccess = () => {
      // save result in db
      const newResult = createNewResultDataset(
        {
          name: name?.length ? name : `${datasetName}_${algorithmName}`,
          filepath: tmpPath,
          algorithmId,
          description,
        },
        db,
      );
      db.get(DATASETS_COLLECTION).push(newResult).write();

      db.get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({
          status: EXECUTION_STATUSES.SUCCESS,
          result: { id: newResult.id },
        })
        .unset('pid')
        .write();

      logger.debug(`save resulting dataset at ${newResult.filepath}`);

      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      return (
        !mainWindow.isDestroyed() &&
        mainWindow?.webContents?.send(channel, {
          type: EXECUTE_ALGORITHM_SUCCESS,
          payload: {
            execution: db
              .get(EXECUTIONS_COLLECTION)
              .find({ id: executionId })
              .value(),
            result: newResult,
          },
        })
      );
    };

    // clean the tmp file at the end of the execution
    const clean = () => {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    };

    const onStop = () => {
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

    // error handling when executing
    const onError = ({ code, log }) => {
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
  } catch (err) {
    logger.error(err);

    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    return (
      !mainWindow.isDestroyed() &&
      mainWindow.webContents.send(channel, {
        type: EXECUTE_ALGORITHM_ERROR,
        error: ERROR_GENERAL,
      })
    );
  }
};

module.exports = { cancelExecutionObject, executeAlgorithm };
