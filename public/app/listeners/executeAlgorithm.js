const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/paths');
const { createNewDataset } = require('./loadDataset');
const { buildExecuteAlgorithmChannel } = require('../../shared/channels');
const {
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASET_TYPES,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  PARAMETER_TYPES,
  ALGORITHM_TYPES,
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
  { name, filepath, algorithmId, description, original },
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
  return { ...result, original };
};

const executeAlgorithm = (mainWindow, db) => (event, { id: executionId }) => {
  const channel = buildExecuteAlgorithmChannel(executionId);
  try {
    // get the execution
    const {
      source: { id: sourceId },
      algorithm: { id: algorithmId },
      result: { name },
      parameters,
      schemaId,
      type,
    } = db.get(EXECUTIONS_COLLECTION).find({ id: executionId }).value();

    // get corresponding dataset
    const { filepath, name: datasetName, description, original } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();

    // get the corresponding algorithm
    const {
      filepath: algorithmFilepath,
      name: algorithmName,
      language,
    } = db.get(ALGORITHMS_COLLECTION).find({ id: algorithmId }).value();

    // get original dataset
    const { filepath: originalfilepath } = db
      .get(DATASETS_COLLECTION)
      .find({ id: original })
      .value();

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
    const onSuccess = ({ log }) => {
      let result;
      let newResult;
      switch (type) {
        case ALGORITHM_TYPES.ANONYMIZATION: {
          // save result in db
          newResult = createNewResultDataset(
            {
              name: name?.length ? name : `${datasetName}_${algorithmName}`,
              filepath: tmpPath,
              algorithmId,
              description,
              original,
            },
            db,
          );
          db.get(DATASETS_COLLECTION).push(newResult).write();
          result = { id: newResult.id };

          logger.debug(`save resulting dataset at ${newResult.filepath}`);

          break;
        }
        case ALGORITHM_TYPES.VALIDATION: {
          const resultString = log.match(
            /{.*"outcome":\s*"(success|warning|failure)".*}/m,
          )?.[0];
          result = resultString ? JSON.parse(resultString) : {};
          break;
        }
        default:
          result = {};
      }

      // save execution result
      db.get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({
          status: EXECUTION_STATUSES.SUCCESS,
          result,
          log,
        })
        .unset('pid')
        .write();

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

    const onLog = ({ log }) => {
      db.get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({ log })
        .write();
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
        .write();

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

    const datasetPathParameter = {
      name: 'dataset_path',
      type: PARAMETER_TYPES.STRING_INPUT,
      value: filepath,
    };

    const outputPathParameter = {
      name: 'output_path',
      type: PARAMETER_TYPES.STRING_INPUT,
      value: tmpPath,
    };

    const originalPathParameter = {
      name: 'original_path',
      type: PARAMETER_TYPES.STRING_INPUT,
      value: originalfilepath,
    };

    const fullParameters = [
      datasetPathParameter,
      outputPathParameter,
      originalPathParameter,
      ...parameters,
    ];

    switch (language) {
      case PROGRAMMING_LANGUAGES.PYTHON:
        return executePythonAlgorithm(
          { algorithmFilepath, parameters: fullParameters, schemaId },
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

module.exports = executeAlgorithm;
