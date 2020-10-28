const { RESULTS_COLLECTION } = require('../db');
const { GET_RESULTS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_RESULTS_SUCCESS,
  GET_RESULTS_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const getResults = (mainWindow, db) => async () => {
  try {
    const results = db.get(RESULTS_COLLECTION).value();
    mainWindow.webContents.send(GET_RESULTS_CHANNEL, {
      type: GET_RESULTS_SUCCESS,
      payload: results,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_RESULTS_CHANNEL, {
      type: GET_RESULTS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getResults;
