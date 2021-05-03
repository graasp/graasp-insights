const logger = require('../logger');
const { EXECUTE_PIPELINE_CHANNEL } = require('../../shared/channels');
const { EXECUTE_PIPELINE_ERROR } = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const executePipelineAlgorithm = require('./executePipelineAlgorithm.js');

const executePipeline = (mainWindow, db) => (
  event,
  { pipeline, sourceId, userProvidedFilename, schemaId },
) => {
  const { algorithms } = pipeline;

  try {
    return executePipelineAlgorithm(mainWindow, db, {
      algorithms,
      sourceId,
      userProvidedFilename,
      schemaId,
      algorithmIndex: 0,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(EXECUTE_PIPELINE_CHANNEL, {
      type: EXECUTE_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = executePipeline;
