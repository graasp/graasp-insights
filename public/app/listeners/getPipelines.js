const { PIPELINES_COLLECTION } = require('../db');
const { GET_PIPELINES_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_PIPELINES_SUCCESS,
  GET_PIPELINES_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const getPipelines = (mainWindow, db) => async () => {
  try {
    const pipelines = db.get(PIPELINES_COLLECTION).value();
    mainWindow.webContents.send(GET_PIPELINES_CHANNEL, {
      type: GET_PIPELINES_SUCCESS,
      payload: pipelines,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_PIPELINES_CHANNEL, {
      type: GET_PIPELINES_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getPipelines;
