const { GET_RESULTS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_RESULTS_SUCCESS,
  GET_RESULTS_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DATASET_TYPES,
  DATASETS_COLLECTION,
} = require('../../shared/constants');
const { DATASETS_FOLDER } = require('../config/paths');

const getResults = (mainWindow, db) => async () => {
  try {
    const results = db
      .get(DATASETS_COLLECTION)
      .filter({ type: DATASET_TYPES.RESULT })
      .value();
    mainWindow.webContents.send(GET_RESULTS_CHANNEL, {
      type: GET_RESULTS_SUCCESS,
      payload: { results, folder: DATASETS_FOLDER },
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
