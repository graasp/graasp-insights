const ObjectId = require('bson-objectid');
const { CREATE_EXECUTION_CHANNEL } = require('../../shared/channels');
const {
  EXECUTION_STATUSES,
  EXECUTIONS_COLLECTION,
  ALGORITHMS_COLLECTION,
  DATASETS_COLLECTION,
} = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_EXECUTION_SUCCESS,
  CREATE_EXECUTION_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const createExecutionObject = (
  db,
  { algorithm, source, result, parameters, schemaId },
) => {
  const id = ObjectId().str;
  const status = EXECUTION_STATUSES.PENDING;
  const executedAt = Date.now();

  const execution = {
    id,
    algorithm,
    source,
    result,
    parameters,
    schemaId,
    status,
    executedAt,
  };

  db.get(EXECUTIONS_COLLECTION).push(execution).write();

  return execution;
};

const createExecution = (mainWindow, db) => async (
  event,
  { algorithmId, sourceId, userProvidedFilename, parameters, schemaId },
) => {
  try {
    const { name: datasetName } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();
    const { name: algorithmName, type } = db
      .get(ALGORITHMS_COLLECTION)
      .find({ id: algorithmId })
      .value();

    // add execution
    const execution = createExecutionObject(db, {
      algorithm: { id: algorithmId, type },
      source: { id: sourceId },
      result: {
        name: userProvidedFilename || `${datasetName}_${algorithmName}`,
      },
      parameters,
      schemaId,
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

module.exports = { createExecutionObject, createExecution };
