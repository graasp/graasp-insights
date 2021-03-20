const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { PIPELINES_COLLECTION } = require('../../shared/constants');
const { ADD_PIPELINE_CHANNEL } = require('../../shared/channels');
const {
  ADD_PIPELINE_SUCCESS,
  ADD_PIPELINE_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const addPipeline = (mainWindow, db) => async (event, { metadata }) => {
  try {
    const { name, description, algorithms } = metadata;

    const id = ObjectId().str;

    const pipeline = {
      id,
      name,
      description,
      algorithms,
    };
    // add entry in lowdb
    db.get(PIPELINES_COLLECTION).push(pipeline).write();

    return mainWindow.webContents.send(ADD_PIPELINE_CHANNEL, {
      type: ADD_PIPELINE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(ADD_PIPELINE_CHANNEL, {
      type: ADD_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = addPipeline;
