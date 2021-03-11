const path = require('path');
const logger = require('../logger');
const { ADD_DEFAULT_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');
const GRAASP_ALGORITHMS = require('../../shared/data/graaspAlgorithms');
const { ALGORITHMS_FOLDER_NAME } = require('../config/config');
const { addPythonAlgorithmInDb } = require('./addAlgorithm');

const saveDefaultAlgorithmInDb = (algorithm, db) => {
  const { filename } = algorithm;
  const srcPath = path.join(__dirname, '..', ALGORITHMS_FOLDER_NAME, filename);

  addPythonAlgorithmInDb({ algorithm, fileLocation: srcPath }, db);
};

const addDefaultAlgorithm = (mainWindow, db) => async (event, { id }) => {
  try {
    const algorithm = GRAASP_ALGORITHMS.find(({ id: algoId }) => algoId === id);
    if (!algorithm) {
      return mainWindow.webContents.send(ADD_DEFAULT_ALGORITHM_CHANNEL, {
        type: ADD_ALGORITHM_ERROR,
        error: ERROR_GENERAL,
      });
    }

    saveDefaultAlgorithmInDb(algorithm, db);

    return mainWindow.webContents.send(ADD_DEFAULT_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(ADD_DEFAULT_ALGORITHM_CHANNEL, {
        type: ADD_ALGORITHM_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(ADD_DEFAULT_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = { addDefaultAlgorithm, saveDefaultAlgorithmInDb };
