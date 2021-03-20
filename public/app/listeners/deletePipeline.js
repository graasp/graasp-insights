const { DELETE_PIPELINE_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { PIPELINES_COLLECTION } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DELETE_PIPELINE_ERROR,
  DELETE_PIPELINE_SUCCESS,
} = require('../../shared/types');

const deletePipeline = (mainWindow, db) => async (event, { id }) => {
  try {
    // get pipeline from local db
    const pipeline = db.get(PIPELINES_COLLECTION).find({ id }).value();
    const { name } = pipeline;

    // remove metadata entry
    db.get(PIPELINES_COLLECTION).remove({ id }).write();

    logger.debug(`Deleted the pipeline ${name} with id ${id}`);

    mainWindow.webContents.send(DELETE_PIPELINE_CHANNEL, {
      type: DELETE_PIPELINE_SUCCESS,
      payload: id,
    });
  } catch (err) {
    mainWindow.webContents.send(DELETE_PIPELINE_CHANNEL, {
      type: DELETE_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deletePipeline;
