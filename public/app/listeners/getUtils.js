const fs = require('fs');
const { GET_UTILS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');
const { GET_UTILS_SUCCESS, GET_UTILS_ERROR } = require('../../shared/types');
const { GRAASP_UTILS, USER_UTILS } = require('../config/config');

const getUtils = (mainWindow) => async () => {
  try {
    const { filepath: userFilepath } = USER_UTILS;
    const { filepath: graaspFilepath } = GRAASP_UTILS;
    if (!fs.existsSync(userFilepath) || !fs.existsSync(graaspFilepath)) {
      mainWindow.webContents.send(GET_UTILS_CHANNEL, {
        type: GET_UTILS_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    const user = fs.readFileSync(userFilepath, 'utf8');
    const graasp = fs.readFileSync(graaspFilepath, 'utf8');

    mainWindow.webContents.send(GET_UTILS_CHANNEL, {
      type: GET_UTILS_SUCCESS,
      payload: { user, graasp },
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_UTILS_CHANNEL, {
      type: GET_UTILS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getUtils;
