const logger = require('../logger');
const { ADD_BUILT_IN_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');
const GRAASP_ALGORITHMS = require('../../shared/graaspAlgorithms');
const { addGraaspAlgorithm } = require('../db');

const addBuiltInAlgorithm = (mainWindow, db) => async (event, { id }) => {
  try {
    const algorithm = GRAASP_ALGORITHMS.find(({ id: algoId }) => algoId === id);
    if (!algorithm) {
      return mainWindow.webContents.send(ADD_BUILT_IN_ALGORITHM_CHANNEL, {
        type: ADD_ALGORITHM_ERROR,
        error: ERROR_GENERAL,
      });
    }

    addGraaspAlgorithm(db, algorithm);

    return mainWindow.webContents.send(ADD_BUILT_IN_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(ADD_BUILT_IN_ALGORITHM_CHANNEL, {
        type: ADD_ALGORITHM_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(ADD_BUILT_IN_ALGORITHM_CHANNEL, {
      type: ADD_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = addBuiltInAlgorithm;
