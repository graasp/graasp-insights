const logger = require('../logger');
const { EXECUTE_PIPELINE_CHANNEL } = require('../../shared/channels');
const { SAVE_PIPELINE_ERROR } = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const runPipelineAlgorithm = require('./pipelineUtils.js');

const executePipeline = (mainWindow, db) => (
  event,
  { pipeline, sourceId, userProvidedFilename, parameters, schemaId },
) => {
  const { algorithms } = pipeline;
  const algorithm = algorithms[0];

  try {
    return runPipelineAlgorithm(
      mainWindow,
      db,
      algorithms,
      algorithm,
      sourceId,
      userProvidedFilename,
      parameters,
      schemaId,
      0,
    );
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(EXECUTE_PIPELINE_CHANNEL, {
      type: SAVE_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = executePipeline;
