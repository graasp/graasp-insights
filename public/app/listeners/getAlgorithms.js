const { ALGORITHMS_COLLECTION } = require('../db');
const { GET_ALGORITHMS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_ALGORITHMS_ERROR,
  GET_ALGORITHMS_SUCCESS,
} = require('../../shared/types');
const { ALGORITHM_TYPES } = require('../../shared/constants');

const getAlgorithms = (mainWindow, db) => async () => {
  try {
    const payload = db
      .get(ALGORITHMS_COLLECTION)
      .value()
      .filter(({ type }) => type !== ALGORITHM_TYPES.UTILS);
    mainWindow.webContents.send(GET_ALGORITHMS_CHANNEL, {
      type: GET_ALGORITHMS_SUCCESS,
      payload,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_ALGORITHMS_CHANNEL, {
      type: GET_ALGORITHMS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getAlgorithms;
