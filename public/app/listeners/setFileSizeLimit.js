const { SET_FILE_SIZE_LIMIT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  SET_FILE_SIZE_LIMIT_SUCCESS,
  SET_FILE_SIZE_LIMIT_ERROR,
} = require('../../shared/types');
const { SETTINGS_COLLECTION } = require('../../shared/constants');

const setFileSizeLimit = (mainWindow, db) => async (event, size) => {
  try {
    db.get(SETTINGS_COLLECTION).set('fileSizeLimit', size).write();
    mainWindow.webContents.send(SET_FILE_SIZE_LIMIT_CHANNEL, {
      type: SET_FILE_SIZE_LIMIT_SUCCESS,
      payload: size,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_FILE_SIZE_LIMIT_CHANNEL, {
      type: SET_FILE_SIZE_LIMIT_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setFileSizeLimit;
