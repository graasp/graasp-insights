const logger = require('../logger');
const { buildExecutePipelineChannel } = require('../../shared/channels');
const { EXECUTE_PIPELINE_ERROR } = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const executePipelineAlgorithm = require('./executePipelineAlgorithm.js');
const { PIPELINES_COLLECTION } = require('../../shared/constants');

const executePipeline = (mainWindow, db) => (event, execution) => {
  const {
    id: pipelineExecutionId,
    algorithm: { id: pipelineId },
    source: { id: sourceId },
    result: { name: resultName },
    schemaId,
  } = execution;

  const { algorithms } = db
    .get(PIPELINES_COLLECTION)
    .find({ id: pipelineId })
    .value();

  const channel = buildExecutePipelineChannel(pipelineExecutionId);

  try {
    return executePipelineAlgorithm(mainWindow, db, {
      pipelineExecutionId,
      pipelineId,
      algorithms,
      sourceId,
      userProvidedFilename: resultName,
      algorithmIndex: 0,
      schemaId,
    });
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(channel, {
      type: EXECUTE_PIPELINE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = executePipeline;
