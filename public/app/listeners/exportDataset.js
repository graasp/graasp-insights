const fs = require('fs');
const path = require('path');
const { EXPORT_DATASET_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  DATASETS_COLLECTION,
  FILE_FORMATS,
  FILE_ENCODINGS,
} = require('../../shared/constants');
const {
  EXPORT_DATASET_SUCCESS,
  EXPORT_DATASET_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { convertJSONToCSV } = require('../utils/file');

const saveDatasetToFile = ({ filepath, destPath }) => {
  const extension = path.extname(destPath);

  switch (extension) {
    case `.${FILE_FORMATS.CSV}`: {
      const content = fs.readFileSync(filepath, FILE_ENCODINGS.UTF8);
      const json = JSON.parse(content);
      const converted = convertJSONToCSV(json);
      fs.writeFileSync(destPath, converted, FILE_ENCODINGS.UTF8);
      break;
    }
    case `.${FILE_FORMATS.JSON}`:
    default:
      fs.copyFileSync(filepath, destPath);
  }
};

const exportDataset = (mainWindow, db) => async (
  event,
  { id, path: destPath },
) => {
  try {
    // get dataset from local db
    const { filepath } = db.get(DATASETS_COLLECTION).find({ id }).value();

    if (!filepath || !fs.existsSync(filepath)) {
      return mainWindow.webContents.send(EXPORT_DATASET_CHANNEL, {
        type: EXPORT_DATASET_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }

    saveDatasetToFile({ filepath, destPath });

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

module.exports = { exportDataset, saveDatasetToFile };
