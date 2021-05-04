const ObjectId = require('bson-objectid');
const { CREATE_EXECUTION_CHANNEL } = require('../../shared/channels');
const {
  EXECUTION_STATUSES,
  EXECUTIONS_COLLECTION,
  DATASETS_COLLECTION,
} = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_EXECUTION_SUCCESS,
  CREATE_EXECUTION_ERROR,
} = require('../../shared/types');
const logger = require('../logger');
const { getAlgorithmOrPipelineById } = require('../utils/algorithm');

const createExecutionInDb = (
  db,
  {
    algorithmId,
    sourceId,
    parameters,
    schemaId,
    userProvidedFilename,
    // linked original execution
    pipelineExecutionId,
  },
) => {
  const id = ObjectId().str;
  const status = EXECUTION_STATUSES.PENDING;
  const executedAt = Date.now();

  // source
  const source = { id: sourceId };

  // algorithm or pipeline
  const { name: algorithmName, type } = getAlgorithmOrPipelineById(
    algorithmId,
    db,
  );
  const algorithm = { id: algorithmId, type };

  // result
  const result = {
    name: userProvidedFilename,
  };
  // build automatic name if no name is provided
  if (!userProvidedFilename) {
    const { name: datasetName } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();

    result.name = `${datasetName}_${algorithmName}`;
  }

  const execution = {
    id,
    algorithm,
    source,
    result,
    parameters,
    schemaId,
    status,
    executedAt,
    pipelineExecutionId,
  };

  db.get(EXECUTIONS_COLLECTION).push(execution).write();

  return execution;
};

const createExecution = (mainWindow, db) => async (
  event,
  { algorithmId, sourceId, userProvidedFilename, parameters, schemaId },
) => {
  try {
    // add execution
    const execution = createExecutionInDb(db, {
      algorithmId,
      sourceId,
      parameters,
      schemaId,
      userProvidedFilename,
    });

    mainWindow.webContents.send(CREATE_EXECUTION_CHANNEL, {
      type: CREATE_EXECUTION_SUCCESS,
      payload: execution,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(CREATE_EXECUTION_CHANNEL, {
      type: CREATE_EXECUTION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = { createExecution, createExecutionInDb };
