const fs = require('fs');
const { EXPORT_DATASET_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../db');
const {
  EXPORT_DATASET_SUCCESS,
  EXPORT_DATASET_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');

const exportDataset = (mainWindow, db) => async (event, { id, path }) => {
  try {
    // get dataset from local db
    const { filepath } = db.get(DATASETS_COLLECTION).find({ id }).value();

    if (!filepath || !fs.existsSync(filepath)) {
      return mainWindow.webContents.send(EXPORT_DATASET_CHANNEL, {
        type: EXPORT_DATASET_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }

    fs.copyFileSync(filepath, path);

    return mainWindow.webContents.send(EXPORT_DATASET_CHANNEL, {
      type: EXPORT_DATASET_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(EXPORT_DATASET_CHANNEL, {
        type: EXPORT_DATASET_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(EXPORT_DATASET_CHANNEL, {
      type: EXPORT_DATASET_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = exportDataset;
