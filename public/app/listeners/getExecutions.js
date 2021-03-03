const { EXECUTIONS_COLLECTION } = require('../../shared/constants');
const { GET_EXECUTIONS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_EXECUTIONS_SUCCESS,
  GET_EXECUTIONS_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const getExecutions = (mainWindow, db) => async () => {
  try {
    const executions = db.get(EXECUTIONS_COLLECTION).value();
    mainWindow.webContents.send(GET_EXECUTIONS_CHANNEL, {
      type: GET_EXECUTIONS_SUCCESS,
      payload: executions,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_EXECUTIONS_CHANNEL, {
      type: GET_EXECUTIONS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getExecutions;
