const fs = require('fs');
const logger = require('../logger');
const { ALGORITHMS_COLLECTION } = require('../db');
const { SAVE_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  SAVE_ALGORITHM_SUCCESS,
  SAVE_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');

const saveAlgorithm = (mainWindow, db) => async (event, { metadata, code }) => {
  const { id, filepath } = metadata;

  try {
    // update metadata content in lowdb
    db.get(ALGORITHMS_COLLECTION).find({ id }).assign(metadata).write();

    // save code
    fs.writeFileSync(filepath, code);

    return mainWindow.webContents.send(SAVE_ALGORITHM_CHANNEL, {
      type: SAVE_ALGORITHM_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(SAVE_ALGORITHM_CHANNEL, {
        type: SAVE_ALGORITHM_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(SAVE_ALGORITHM_CHANNEL, {
      type: SAVE_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = saveAlgorithm;
