const { GET_PIPELINE_CHANNEL } = require('../../shared/channels');
const { PIPELINES_COLLECTION } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  GET_PIPELINE_SUCCESS,
  GET_PIPELINE_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const getPipeline = (mainWindow, db) => async (event, { id }) => {
  try {
    // get a pipeline from local db
    const pipeline = db.get(PIPELINES_COLLECTION).find({ id }).value();
    return mainWindow.webContents.send(GET_PIPELINE_CHANNEL, {
      type: GET_PIPELINE_SUCCESS,
      payload: pipeline,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(GET_PIPELINE_CHANNEL, {
      type: GET_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = getPipeline;
