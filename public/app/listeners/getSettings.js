const { GET_SETTINGS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_ERROR,
} = require('../../shared/types');
const { SETTINGS_COLLECTION } = require('../../shared/constants');

const getSettings = (mainWindow, db) => async () => {
  try {
    const settings = db.get(SETTINGS_COLLECTION).value();
    mainWindow.webContents.send(GET_SETTINGS_CHANNEL, {
      type: GET_SETTINGS_SUCCESS,
      payload: settings,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_SETTINGS_CHANNEL, {
      type: GET_SETTINGS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getSettings;
