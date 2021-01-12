const { DEFAULT_LANG } = require('../config/config');
const { GET_LANGUAGE_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const logger = require('../logger');
const {
  GET_LANGUAGE_SUCCESS,
  GET_LANGUAGE_ERROR,
} = require('../../shared/types');
const { SETTINGS_COLLECTION } = require('../db');

const getLanguage = (mainWindow, db) => async () => {
  try {
    const lang =
      db.get(SETTINGS_COLLECTION).get('lang').value() || DEFAULT_LANG;

    mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, {
      type: GET_LANGUAGE_SUCCESS,
      payload: lang,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, {
      type: GET_LANGUAGE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getLanguage;
