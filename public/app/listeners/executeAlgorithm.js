const path = require('path');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/paths');
const { buildExecuteAlgorithmChannel } = require('../../shared/channels');
const {
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  ALGORITHM_TYPES,
} = require('../../shared/constants');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const {
  ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
  ERROR_GENERAL,
} = require('../../shared/errors');
const {
  EXECUTE_ALGORITHM_SUCCESS,
  EXECUTE_ALGORITHM_ERROR,
} = require('../../shared/types');
const {
  buildOnRunCallback,
  buildOnStopCallback,
  buildOnErrorCallback,
  buildCleanCallback,
  buildOnLogCallback,
  buildFilepathParameter,
} = require('../utils/execution');
const { cancelExecutionById } = require('./cancelExecution');
const createNewResultDataset = require('../utils/result');
const {
  ALGORITHM_DATASET_PATH_NAME,
  ALGORITHM_ORIGIN_PATH_NAME,
  ALGORITHM_OUTPUT_PATH_NAME,
} = require('../config/config');
const { parseValidationResult } = require('../utils/validation');

const executeAlgorithm = (mainWindow, db) => (event, { id: executionId }) => {
  const channel = buildExecuteAlgorithmChannel(executionId);
  try {
    // get the execution
    const {
      source: { id: sourceId },
      algorithm: { id: algorithmId, type },
      result: { name },
      parameters,
      schemaId,
    } = db.get(EXECUTIONS_COLLECTION).find({ id: executionId }).value();

    // get corresponding dataset
    const { filepath, description, originId } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();

    // get the corresponding algorithm
    const { filepath: algorithmFilepath, language } = db
      .get(ALGORITHMS_COLLECTION)
      .find({ id: algorithmId })
      .value();

    // get original dataset
    const { filepath: originfilepath } = db
      .get(DATASETS_COLLECTION)
      .find({ id: originId })
      .value() || { filepath };

    const tmpPath = path.join(DATASETS_FOLDER, `tmp_${executionId}.json`);

    // prepare onRun callback function
    // set execution as running and pid
    const onRun = buildOnRunCallback(mainWindow, db, channel, { executionId });

    // prepare success callback function
    // copy tmp as new result dataset
    // update execution and return it
    const onSuccess = ({ log }) => {
      let result;
      let newResult;
      switch (type) {
        case ALGORITHM_TYPES.ANONYMIZATION: {
          // save result in db
          newResult = createNewResultDataset(db, {
            name,
            filepath: tmpPath,
            algorithmId,
            description,
            originId,
          });
          result = { id: newResult.id };

          logger.debug(`save resulting dataset at ${newResult.filepath}`);

          break;
        }
        case ALGORITHM_TYPES.VALIDATION: {
          const resultString = parseValidationResult(log);
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

    const clean = buildCleanCallback(tmpPath);
    const onStop = buildOnStopCallback(mainWindow, db, channel, {
      executionId,
    });
    const onError = buildOnErrorCallback(mainWindow, db, channel, {
      executionId,
    });
    const onLog = buildOnLogCallback(mainWindow, db, channel, { executionId });

    // path to the dataset
    const datasetPathParameter = buildFilepathParameter(
      ALGORITHM_DATASET_PATH_NAME,
      filepath,
    );

    // destination path
    // indicates where the algorithm should save the resulting dataset
    const outputPathParameter = buildFilepathParameter(
      ALGORITHM_OUTPUT_PATH_NAME,
      tmpPath,
    );

    // path to the original dataset prior to any execution
    // useful when data from the original dataset is necessary
    // (detect names algorithm for example)
    const originPathParameter = buildFilepathParameter(
      ALGORITHM_ORIGIN_PATH_NAME,
      originfilepath,
    );

    const fullParameters = [
      datasetPathParameter,
      outputPathParameter,
      originPathParameter,
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

module.exports = { cancelExecutionById, executeAlgorithm };
