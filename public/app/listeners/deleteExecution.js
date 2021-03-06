const { DELETE_EXECUTION_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { EXECUTIONS_COLLECTION } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DELETE_EXECUTION_SUCCESS,
  DELETE_EXECUTION_ERROR,
} = require('../../shared/types');

const deleteExecution = (mainWindow, db) => async (event, { id }) => {
  try {
    db.get(EXECUTIONS_COLLECTION).remove({ id }).write();

    logger.debug(`Execution ${id} successfully deleted`);

    mainWindow.webContents.send(DELETE_EXECUTION_CHANNEL, {
      type: DELETE_EXECUTION_SUCCESS,
      payload: id,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(DELETE_EXECUTION_CHANNEL, {
      type: DELETE_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteExecution;
