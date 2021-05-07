const path = require('path');
const fs = require('fs');
const { GET_ALGORITHM_CODE_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_ALGORITHM_CODE_ERROR,
  GET_ALGORITHM_CODE_SUCCESS,
} = require('../../shared/types');
const { FILE_ENCODINGS } = require('../../shared/constants');
const { ERROR_MISSING_FILE, ERROR_GENERAL } = require('../../shared/errors');
const { ALGORITHMS_FOLDER_NAME } = require('../config/config');

const getAlgorithmCode = (mainWindow) => async (
  event,
  { filepath, filename, isGraasp },
) => {
  try {
    let code;
    if (isGraasp) {
      code = fs.readFileSync(
        path.join(__dirname, '../', ALGORITHMS_FOLDER_NAME, filename),
        FILE_ENCODINGS.UTF8,
      );
    } else {
      code = fs.readFileSync(filepath, FILE_ENCODINGS.UTF8);
    }

    return mainWindow.webContents.send(GET_ALGORITHM_CODE_CHANNEL, {
      type: GET_ALGORITHM_CODE_SUCCESS,
      payload: code,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(GET_ALGORITHM_CODE_CHANNEL, {
        type: GET_ALGORITHM_CODE_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(GET_ALGORITHM_CODE_CHANNEL, {
      type: GET_ALGORITHM_CODE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getAlgorithmCode;
