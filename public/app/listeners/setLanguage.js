const { SET_LANGUAGE_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  SET_LANGUAGE_SUCCESS,
  SET_LANGUAGE_ERROR,
} = require('../../shared/types');
const { SETTINGS_COLLECTION } = require('../db');

const setLanguage = (mainWindow, db) => async (event, lang) => {
  try {
    db.get(SETTINGS_COLLECTION).set('lang', lang).write();
    mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, {
      type: SET_LANGUAGE_SUCCESS,
      payload: lang,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, {
      type: SET_LANGUAGE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setLanguage;
