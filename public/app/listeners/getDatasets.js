const { DATASETS_COLLECTION } = require('../db');
const { GET_DATASETS_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_DATASETS_SUCCESS,
  GET_DATASETS_ERROR,
} = require('../../shared/types');
const logger = require('../logger');
const { DATASET_TYPES } = require('../../shared/constants');

const getDatasets = (mainWindow, db) => async () => {
  try {
    const datasets = db
      .get(DATASETS_COLLECTION)
      .filter({ type: DATASET_TYPES.SOURCE })
      .value();
    mainWindow.webContents.send(GET_DATASETS_CHANNEL, {
      type: GET_DATASETS_SUCCESS,
      payload: datasets,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_DATASETS_CHANNEL, {
      type: GET_DATASETS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getDatasets;
