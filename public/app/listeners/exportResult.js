const fs = require('fs');
const { EXPORT_RESULT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../../shared/constants');
const {
  EXPORT_RESULT_SUCCESS,
  EXPORT_RESULT_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { saveDatasetToFile } = require('./exportDataset');

const exportResult = (mainWindow, db) => async (
  event,
  { id, path: destPath },
) => {
  try {
    // get dataset from local db
    const { filepath } = db.get(DATASETS_COLLECTION).find({ id }).value();

    if (!filepath || !fs.existsSync(filepath)) {
      return mainWindow.webContents.send(EXPORT_RESULT_CHANNEL, {
        type: EXPORT_RESULT_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }

    saveDatasetToFile({ filepath, destPath });

    return mainWindow.webContents.send(EXPORT_RESULT_CHANNEL, {
      type: EXPORT_RESULT_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(EXPORT_RESULT_CHANNEL, {
        type: EXPORT_RESULT_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(EXPORT_RESULT_CHANNEL, {
      type: EXPORT_RESULT_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = exportResult;
