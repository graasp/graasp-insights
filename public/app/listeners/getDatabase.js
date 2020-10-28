const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const { GET_DATABASE_CHANNEL } = require('../../shared/channels');
const {
  GET_DATABASE_SUCCESS,
  GET_DATABASE_ERROR,
} = require('../../shared/types');

const getDatabase = (mainWindow, db) => async () => {
  try {
    // get space from local db
    const database = db.getState();
    mainWindow.webContents.send(GET_DATABASE_CHANNEL, {
      type: GET_DATABASE_SUCCESS,
      payload: database,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_DATABASE_CHANNEL, {
      type: GET_DATABASE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getDatabase;
