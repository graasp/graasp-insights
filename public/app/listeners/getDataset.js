const fs = require('fs');
const { GET_DATASET_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../db');
const {
  GET_DATASET_SUCCESS,
  GET_DATASET_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { validateGraaspSchema } = require('../schema');

const getDataset = (mainWindow, db) => async (event, { id }) => {
  try {
    // get dataset from local db
    const dataset = db.get(DATASETS_COLLECTION).find({ id }).value();

    let content = null;
    const { filepath } = dataset;
    content = fs.readFileSync(filepath, 'utf8');
    const jsonContent = JSON.parse(content);
    const { valid, error } = validateGraaspSchema(jsonContent);
    if (!valid) {
      logger.debug(`Invalid schema: ${error}`);
    }

    return mainWindow.webContents.send(GET_DATASET_CHANNEL, {
      type: GET_DATASET_SUCCESS,
      payload: { ...dataset, content, valid },
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(GET_DATASET_CHANNEL, {
        type: GET_DATASET_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(GET_DATASET_CHANNEL, {
      type: GET_DATASET_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getDataset;
