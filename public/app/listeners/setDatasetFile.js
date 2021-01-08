const fs = require('fs');
const logger = require('../logger');
const { SET_DATASET_FILE_CHANNEL } = require('../../shared/channels');
const {
  SET_DATASET_FILE_SUCCESS,
  SET_DATASET_FILE_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { DATASETS_COLLECTION } = require('../db');
const { detectSchema } = require('../schema');

const setDatasetFile = (mainWindow, db) => async (e, { id, content }) => {
  try {
    const { filepath } = db.get(DATASETS_COLLECTION).find({ id }).value();

    if (!fs.existsSync(filepath)) {
      return mainWindow.webContents.send(SET_DATASET_FILE_CHANNEL, {
        type: SET_DATASET_FILE_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    const contentAsString = JSON.stringify(content, null, 2);
    fs.writeFileSync(filepath, contentAsString);

    // check schema
    const schemaId = detectSchema(content);
    db.get(DATASETS_COLLECTION).find({ id }).assign({ schemaId }).write();

    return mainWindow.webContents.send(SET_DATASET_FILE_CHANNEL, {
      type: SET_DATASET_FILE_SUCCESS,
      payload: { content: contentAsString, schemaId },
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SET_DATASET_FILE_CHANNEL, {
      type: SET_DATASET_FILE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setDatasetFile;
