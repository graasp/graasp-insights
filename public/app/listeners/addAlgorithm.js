const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { ALGORITHMS_FOLDER } = require('../config/paths');
const { ADD_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');
const {
  PROGRAMMING_LANGUAGES,
  ALGORITHMS_COLLECTION,
} = require('../../shared/constants');
const { getFileStats } = require('../utils/file');

const addPythonAlgorithm = ({ algorithm, fileLocation }, db) => {
  logger.debug('add python algorithm');
  const { name, description, author, code, parameters, type } = algorithm;

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
    type,
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

  db.get(ALGORITHMS_COLLECTION).push(metadata).write();
};

const addAlgorithm = (mainWindow, db) => async (
  event,
  { algorithm, fileLocation },
) => {
  try {
    addPythonAlgorithm({ algorithm, fileLocation }, db);

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

module.exports = { addAlgorithm, addPythonAlgorithm };
