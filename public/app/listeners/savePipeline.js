const logger = require('../logger');
const { PIPELINES_COLLECTION } = require('../../shared/constants');
const { SAVE_PIPELINE_CHANNEL } = require('../../shared/channels');
const {
  SAVE_PIPELINE_SUCCESS,
  SAVE_PIPELINE_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const savePipeline = (mainWindow, db) => async (event, { metadata }) => {
  const { id } = metadata;

  try {
    // update metadata content in lowdb
    db.get(PIPELINES_COLLECTION).find({ id }).assign(metadata).write();

    return mainWindow.webContents.send(SAVE_PIPELINE_CHANNEL, {
      type: SAVE_PIPELINE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SAVE_PIPELINE_CHANNEL, {
      type: SAVE_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = savePipeline;
