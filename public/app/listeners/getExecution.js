const { GET_EXECUTION_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_EXECUTION_SUCCESS,
  GET_EXECUTION_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const { EXECUTIONS_COLLECTION } = require('../../../src/shared/constants');

const getExecution = (mainWindow, db) => async (event, { id }) => {
  try {
    const execution = db.get(EXECUTIONS_COLLECTION).find({ id }).value();

    return mainWindow.webContents.send(GET_EXECUTION_CHANNEL, {
      type: GET_EXECUTION_SUCCESS,
      payload: execution,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(GET_EXECUTION_CHANNEL, {
      type: GET_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getExecution;
