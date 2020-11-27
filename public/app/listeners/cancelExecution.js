const kill = require('tree-kill');
const { ERROR_GENERAL } = require('../../shared/errors');
const { EXECUTIONS_COLLECTION } = require('../db');
const logger = require('../logger');
const { EXECUTION_STATUSES } = require('../../shared/constants');
const { STOP_EXECUTION_CHANNEL } = require('../../shared/channels');
const {
  STOP_EXECUTION_SUCCESS,
  STOP_EXECUTION_ERROR,
} = require('../../shared/types');
const { cancelExecutionObject } = require('./executeAlgorithm');

const cancelExecutionById = (db, id) => {
  const execution = db.get(EXECUTIONS_COLLECTION).find({ id });
  const { pid } = execution.value();

  // kill correponding process
  kill(pid);
  cancelExecutionObject(db, id);

  logger.debug('stop execution with id ', id);
};

const cancelExecution = (mainWindow, db) => async (e, { id }) => {
  try {
    cancelExecutionById(db, id);

    mainWindow.webContents.send(STOP_EXECUTION_CHANNEL, {
      type: STOP_EXECUTION_SUCCESS,
    });
  } catch (err) {
    logger.log(err);
    mainWindow.webContents.send(STOP_EXECUTION_CHANNEL, {
      type: STOP_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
  // todo: stop associated process
};

const cancelAllRunningExecutions = async (db) => {
  const runningExecutions = db
    .get(EXECUTIONS_COLLECTION)
    .filter({ status: EXECUTION_STATUSES.RUNNING })
    .value();
  // eslint-disable-next-line no-restricted-syntax
  for (const { id } of runningExecutions) {
    // eslint-disable-next-line no-await-in-loop
    await cancelExecutionById(db, id);
  }
};

module.exports = { cancelExecution, cancelAllRunningExecutions };
