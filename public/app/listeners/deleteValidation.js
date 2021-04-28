const { DELETE_VALIDATION_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { VALIDATIONS_COLLECTION } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DELETE_VALIDATION_SUCCESS,
  DELETE_VALIDATION_ERROR,
} = require('../../shared/types');

const deleteValidation = (mainWindow, db) => async (event, { id }) => {
  try {
    db.get(VALIDATIONS_COLLECTION).remove({ id }).write();

    logger.debug(`Validation ${id} successfully deleted`);

    mainWindow.webContents.send(DELETE_VALIDATION_CHANNEL, {
      type: DELETE_VALIDATION_SUCCESS,
      payload: id,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(DELETE_VALIDATION_CHANNEL, {
      type: DELETE_VALIDATION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteValidation;
