const fs = require('fs');
const { GET_RESULT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { RESULTS_COLLECTION } = require('../db');
const { GET_RESULT_SUCCESS, GET_RESULT_ERROR } = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');

const getResult = (mainWindow, db) => async (event, { id }) => {
  try {
    // get result from local db
    const result = db.get(RESULTS_COLLECTION).find({ id }).value();

    let content = null;
    const { filepath } = result;
    content = fs.readFileSync(filepath, 'utf8');

    return mainWindow.webContents.send(GET_RESULT_CHANNEL, {
      type: GET_RESULT_SUCCESS,
      payload: { ...result, content },
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(GET_RESULT_CHANNEL, {
        type: GET_RESULT_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(GET_RESULT_CHANNEL, {
      type: GET_RESULT_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getResult;
