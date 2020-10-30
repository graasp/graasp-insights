const fs = require('fs');
const { GET_ALGORITHM_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ALGORITHMS_COLLECTION } = require('../db');
const { GET_ALGORITHM_SUCCESS } = require('../../shared/types');
const { GET_ALGORITHM_ERROR } = require('../../shared/types');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');

const getAlgorithm = (mainWindow, db) => async (event, { id }) => {
  try {
    // get algorithm from local db
    const algorithm = db.get(ALGORITHMS_COLLECTION).find({ id }).value();

    const { filepath } = algorithm;
    const code = fs.readFileSync(filepath, 'utf8');
    const payload = { ...algorithm, code };

    return mainWindow.webContents.send(GET_ALGORITHM_CHANNEL, {
      type: GET_ALGORITHM_SUCCESS,
      payload,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(GET_ALGORITHM_CHANNEL, {
        type: GET_ALGORITHM_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(GET_ALGORITHM_CHANNEL, {
      type: GET_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getAlgorithm;
