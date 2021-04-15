const kill = require('tree-kill');
const { ERROR_GENERAL } = require('../../shared/errors');
const logger = require('../logger');
const {
  EXECUTION_STATUSES,
  VALIDATIONS_COLLECTION,
} = require('../../shared/constants');
const { STOP_VALIDATION_EXECUTION_CHANNEL } = require('../../shared/channels');
const {
  STOP_VALIDATION_EXECUTION_SUCCESS,
  STOP_VALIDATION_EXECUTION_ERROR,
} = require('../../shared/types');

const cancelValidationExecutionObject = (db, validationId, executionId) => {
  db.get(VALIDATIONS_COLLECTION)
    .find({ id: validationId })
    .get('executions')
    .find({ id: executionId })
    .assign({ status: EXECUTION_STATUSES.ERROR })
    .unset('pid')
    .write();
};

const cancelValidationExecutionById = (db, validationId, executionId) => {
  const execution = db
    .get(VALIDATIONS_COLLECTION)
    .find({ id: validationId })
    .get('executions')
    .find({ id: executionId });
  const { pid } = execution.value();

  // kill correponding process
  kill(pid);
  cancelValidationExecutionObject(db, validationId, executionId);

  logger.debug('stop validation execution with id ', executionId);
};

const cancelValidationExecution = (mainWindow, db) => async (
  e,
  { validationId, executionId },
) => {
  try {
    cancelValidationExecutionById(db, validationId, executionId);

    const execution = db
      .get(VALIDATIONS_COLLECTION)
      .find({ id: validationId })
      .get('executions')
      .find({ id: executionId })
      .value();

    mainWindow.webContents.send(STOP_VALIDATION_EXECUTION_CHANNEL, {
      type: STOP_VALIDATION_EXECUTION_SUCCESS,
      payload: { validationId, executionId, execution },
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(STOP_VALIDATION_EXECUTION_CHANNEL, {
      type: STOP_VALIDATION_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = {
  cancelValidationExecution,
  cancelValidationExecutionById,
  cancelValidationExecutionObject,
};
