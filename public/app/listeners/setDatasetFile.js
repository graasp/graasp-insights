const fs = require('fs');
const logger = require('../logger');
const { SET_DATASET_FILE_CHANNEL } = require('../../shared/channels');
const {
  SET_DATASET_FILE_SUCCESS,
  SET_DATASET_FILE_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { DATASETS_COLLECTION } = require('../../shared/constants');
const { ARRAY_OF_JSON_SCHEMA } = require('../schema/config');
const { detectSchemas, validateSchema } = require('../schema/detectSchemas');
const { getFileStats } = require('../utils/file');

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

    // check schemas
    const schemaIds = detectSchemas(content, db);
    const isTabular = validateSchema(content, ARRAY_OF_JSON_SCHEMA);

    // size and modification date
    const { lastModified, sizeInKiloBytes } = getFileStats(filepath);

    db.get(DATASETS_COLLECTION)
      .find({ id })
      .assign({ schemaIds, isTabular, lastModified, size: sizeInKiloBytes })
      .write();

    return mainWindow.webContents.send(SET_DATASET_FILE_CHANNEL, {
      type: SET_DATASET_FILE_SUCCESS,
      payload: { content: contentAsString, schemaIds },
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
