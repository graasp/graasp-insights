const { VALIDATIONS_COLLECTION } = require('../../shared/constants');
const { GET_VALIDATIONS_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  GET_VALIDATIONS_SUCCESS,
  GET_VALIDATIONS_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const getValidations = (mainWindow, db) => async () => {
  try {
    const validations = db.get(VALIDATIONS_COLLECTION).value();
    mainWindow.webContents.send(GET_VALIDATIONS_CHANNEL, {
      type: GET_VALIDATIONS_SUCCESS,
      payload: validations,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_VALIDATIONS_CHANNEL, {
      type: GET_VALIDATIONS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getValidations;
