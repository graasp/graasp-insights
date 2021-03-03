const { GET_DATASETS_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_DATASETS_SUCCESS,
  GET_DATASETS_ERROR,
} = require('../../shared/types');
const logger = require('../logger');
const {
  DATASET_TYPES,
  DATASETS_COLLECTION,
} = require('../../shared/constants');
const { DATASETS_FOLDER } = require('../config/paths');

const getDatasets = (mainWindow, db) => async () => {
  try {
    const datasets = db
      .get(DATASETS_COLLECTION)
      .filter({ type: DATASET_TYPES.SOURCE })
      .value();
    mainWindow.webContents.send(GET_DATASETS_CHANNEL, {
      type: GET_DATASETS_SUCCESS,
      payload: { datasets, folder: DATASETS_FOLDER },
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
