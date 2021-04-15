const logger = require('../logger');
const {
  buildExecuteValidationAlgorithmChannel,
} = require('../../shared/channels');
const {
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  VALIDATIONS_COLLECTION,
  PARAMETER_TYPES,
} = require('../../shared/constants');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const {
  ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
  ERROR_EXECUTION_PROCESS,
  ERROR_GENERAL,
} = require('../../shared/errors');
const {
  EXECUTE_VALIDATION_ALGORITHM_SUCCESS,
  EXECUTE_VALIDATION_ALGORITHM_ERROR,
  STOP_VALIDATION_EXECUTION_SUCCESS,
} = require('../../shared/types');
const {
  cancelValidationExecutionObject,
} = require('./cancelValidationExecution');

const executeValidationAlgorithm = (mainWindow, db) => (
  event,
  { validationId, execution, source: { id: sourceId }, schemaId },
) => {
  const { id: executionId, algorithmId, parameters } = execution;
  const channel = buildExecuteValidationAlgorithmChannel(
    validationId,
    executionId,
  );

  try {
    // get corresponding dataset
    const { filepath, original } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();

    // get original dataset
    const { filepath: originalfilepath } = db
      .get(DATASETS_COLLECTION)
      .find({ id: original })
      .value();

    // get the corresponding algorithm
    const { filepath: algorithmFilepath, language } = db
      .get(ALGORITHMS_COLLECTION)
      .find({ id: algorithmId })
      .value();

    // prepare onRun callback function
    // set execution as running and pid
    const onRun = ({ pid }) => {
      db.get(VALIDATIONS_COLLECTION)
        .find({ id: validationId })
        .get('executions')
        .find({ id: executionId })
        .assign({ status: EXECUTION_STATUSES.RUNNING, pid })
        .write();
    };

    // prepare success callback function
    // parse validation result
    // update execution and return it
    const onSuccess = ({ log }) => {
      const resultString = log.match(
        /{.*"outcome":\s*"(success|warning|failure)".*}/m,
      )?.[0];
      const result = resultString ? JSON.parse(resultString) : {};

      db.get(VALIDATIONS_COLLECTION)
        .find({ id: validationId })
        .get('executions')
        .find({ id: executionId })
        .assign({ status: EXECUTION_STATUSES.SUCCESS, result, log })
        .unset('pid')
        .write();

      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      return (
        !mainWindow.isDestroyed() &&
        mainWindow?.webContents?.send(channel, {
          type: EXECUTE_VALIDATION_ALGORITHM_SUCCESS,
          payload: {
            validationId,
            executionId,
            execution: db
              .get(VALIDATIONS_COLLECTION)
              .find({ id: validationId })
              .get('executions')
              .find({ id: executionId })
              .value(),
          },
        })
      );
    };

    const onStop = () => {
      cancelValidationExecutionObject(db, validationId, executionId);

      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      return (
        !mainWindow.isDestroyed() &&
        mainWindow?.webContents?.send(channel, {
          type: STOP_VALIDATION_EXECUTION_SUCCESS,
          payload: {
            validationId,
            executionId,
            execution: db
              .get(VALIDATIONS_COLLECTION)
              .find({ id: validationId })
              .get('executions')
              .find({ id: executionId })
              .value(),
          },
        })
      );
    };

    const onLog = ({ log }) => {
      db.get(VALIDATIONS_COLLECTION)
        .find({ id: validationId })
        .get('executions')
        .find({ id: executionId })
        .assign({ log })
        .write();
    };

    // error handling when executing
    const onError = ({ code, log }) => {
      logger.error(
        `process for validation ${validationId} exited with code ${code}`,
      );

      db.get(VALIDATIONS_COLLECTION)
        .find({ id: validationId })
        .get('executions')
        .find({ id: executionId })
        .assign({ status: EXECUTION_STATUSES.ERROR, result: {} })
        .unset('pid')
        .write();

      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      return (
        !mainWindow.isDestroyed() &&
        mainWindow?.webContents?.send(channel, {
          type: EXECUTE_VALIDATION_ALGORITHM_ERROR,
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

    const originalPathParameter = {
      name: 'original_path',
      type: PARAMETER_TYPES.STRING_INPUT,
      value: originalfilepath,
    };

    const fullParameters = [
      datasetPathParameter,
      originalPathParameter,
      ...parameters,
    ];

    switch (language) {
      case PROGRAMMING_LANGUAGES.PYTHON:
        return executePythonAlgorithm(
          { algorithmFilepath, parameters: fullParameters, schemaId },
          { onRun, onStop, onSuccess, onError, onLog },
        );

      default:
        db.get(VALIDATIONS_COLLECTION)
          .find({ id: validationId })
          .get('executions')
          .find({ id: executionId })
          .assign({ status: EXECUTION_STATUSES.ERROR, result: {} })
          .write();

        // check whether mainWindow still exist in case of
        // the app quits before the process get killed
        return (
          !mainWindow.isDestroyed() &&
          mainWindow.webContents.send(channel, {
            type: EXECUTE_VALIDATION_ALGORITHM_ERROR,
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
        type: EXECUTE_VALIDATION_ALGORITHM_ERROR,
        error: ERROR_GENERAL,
      })
    );
  }
};

module.exports = executeValidationAlgorithm;
