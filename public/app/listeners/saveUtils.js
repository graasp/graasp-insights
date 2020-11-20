const fs = require('fs');
const { SAVE_UTILS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const { SAVE_UTILS_SUCCESS, SAVE_UTILS_ERROR } = require('../../shared/types');
const { USER_UTILS } = require('../config/config');

const saveUtils = (mainWindow) => async (event, userUtils) => {
  try {
    const { filepath } = USER_UTILS;
    fs.writeFileSync(filepath, userUtils);

    return mainWindow.webContents.send(SAVE_UTILS_CHANNEL, {
      type: SAVE_UTILS_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SAVE_UTILS_CHANNEL, {
      type: SAVE_UTILS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = saveUtils;
