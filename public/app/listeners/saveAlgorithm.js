const fs = require('fs');
const logger = require('../logger');
const { ALGORITHMS_COLLECTION } = require('../db');
const { SAVE_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  SAVE_ALGORITHM_SUCCESS,
  SAVE_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const saveAlgorithm = (mainWindow, db) => async (event, { metadata, code }) => {
  const { id, filepath } = metadata;

  try {
    // save code
    fs.writeFileSync(filepath, code, {
      // modifies the file instead of replacing it
      flag: 'r+',
    });

    // get file data
    const stats = fs.statSync(filepath);
    const { size, mtimeMs } = stats;
    const sizeInKiloBytes = size / 1000;
    const lastModified = mtimeMs;

    const newMetadata = {
      ...metadata,
      lastModified,
      size: sizeInKiloBytes,
    };

    // update metadata content in lowdb
    db.get(ALGORITHMS_COLLECTION).find({ id }).assign(newMetadata).write();

    return mainWindow.webContents.send(SAVE_ALGORITHM_CHANNEL, {
      type: SAVE_ALGORITHM_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SAVE_ALGORITHM_CHANNEL, {
      type: SAVE_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = saveAlgorithm;
