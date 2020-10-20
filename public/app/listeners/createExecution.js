const ObjectId = require('bson-objectid');
const { EXECUTIONS_COLLECTION } = require('../db');
const { CREATE_EXECUTION_CHANNEL } = require('../../shared/channels');
const { EXECUTION_STATUSES } = require('../config/config');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_EXECUTION_SUCCESS,
  CREATE_EXECUTION_ERROR,
} = require('../../shared/types');

const createExecution = (mainWindow, db) => async (
  event,
  { algorithmId, datasetId },
) => {
  try {
    // add execution
    const execution = {
      id: ObjectId().str,
      algorithmId,
      datasetId,
      executedAt: Date.now(),
      status: EXECUTION_STATUSES.PENDING,
    };
    db.get(EXECUTIONS_COLLECTION).push(execution).write();
    mainWindow.webContents.send(CREATE_EXECUTION_CHANNEL, {
      type: CREATE_EXECUTION_SUCCESS,
      payload: execution,
    });
  } catch (e) {
    mainWindow.webContents.send(CREATE_EXECUTION_CHANNEL, {
      type: CREATE_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = createExecution;
