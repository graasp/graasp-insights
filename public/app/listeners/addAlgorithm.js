const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { ALGORITHMS_FOLDER } = require('../config/paths');
const { ALGORITHMS_COLLECTION } = require('../db');
const { ADD_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');
const { PROGRAMMING_LANGUAGES } = require('../../shared/constants');
const { getFileStats } = require('../utils/file');

const addAlgorithm = (mainWindow, db) => async (event, algorithm) => {
  try {
    const {
      name,
      description,
      author,
      fileLocation,
      code,
      parameters,
    } = algorithm;

    const id = ObjectId().str;
    const filename = `${id}.py`;
    const filepath = path.join(ALGORITHMS_FOLDER, filename);
    const language = PROGRAMMING_LANGUAGES.PYTHON;

    // copy or create file
    if (fileLocation) {
      fs.copyFileSync(fileLocation, filepath);
    } else {
      fs.writeFileSync(filepath, code);
    }

    const { createdAt, lastModified, sizeInKiloBytes } = getFileStats(filepath);

    const metadata = {
      id,
      name,
      description,
      filename,
      filepath,
      author,
      language,
      parameters,
      createdAt,
      lastModified,
      size: sizeInKiloBytes,
    };

    // add entry in lowdb
    db.get(ALGORITHMS_COLLECTION).push(metadata).write();

    return mainWindow.webContents.send(ADD_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(ADD_ALGORITHM_CHANNEL, {
        type: ADD_ALGORITHM_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(ADD_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = addAlgorithm;
