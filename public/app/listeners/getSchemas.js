const { SCHEMAS_COLLECTION } = require('../../shared/constants');
const { GET_SCHEMAS_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_SCHEMAS_SUCCESS,
  GET_SCHEMAS_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const getSchemas = (mainWindow, db) => async () => {
  try {
    const schemas = db.get(SCHEMAS_COLLECTION).value();

    mainWindow.webContents.send(GET_SCHEMAS_CHANNEL, {
      type: GET_SCHEMAS_SUCCESS,
      payload: schemas,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_SCHEMAS_CHANNEL, {
      type: GET_SCHEMAS_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getSchemas;
