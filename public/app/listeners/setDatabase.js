const logger = require('../logger');
const { SET_DATABASE_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  SET_DATABASE_ERROR,
  SET_DATABASE_SUCCESS,
} = require('../../shared/types');

const setDatabase = (mainWindow, db) => async (e, payload) => {
  try {
    db.setState(payload).write();
    const database = db.getState();

    mainWindow.webContents.send(SET_DATABASE_CHANNEL, {
      type: SET_DATABASE_SUCCESS,
      payload: database,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(SET_DATABASE_CHANNEL, {
      type: SET_DATABASE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setDatabase;
