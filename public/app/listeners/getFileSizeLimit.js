const { GET_FILE_SIZE_LIMIT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_FILE_SIZE_LIMIT_SUCCESS,
  GET_FILE_SIZE_LIMIT_ERROR,
} = require('../../shared/types');

const getFileSizeLimit = (mainWindow, db) => async () => {
  try {
    const size = db.get('settings.fileSizeLimit').value();
    mainWindow.webContents.send(GET_FILE_SIZE_LIMIT_CHANNEL, {
      type: GET_FILE_SIZE_LIMIT_SUCCESS,
      payload: size,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_FILE_SIZE_LIMIT_CHANNEL, {
      type: GET_FILE_SIZE_LIMIT_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getFileSizeLimit;
