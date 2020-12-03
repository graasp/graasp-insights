const ObjectId = require('bson-objectid');
const {
  EXECUTIONS_COLLECTION,
  ALGORITHMS_COLLECTION,
  DATASETS_COLLECTION,
} = require('../db');
const { CREATE_EXECUTION_CHANNEL } = require('../../shared/channels');
const { EXECUTION_STATUSES } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_EXECUTION_SUCCESS,
  CREATE_EXECUTION_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const createExecution = (mainWindow, db) => async (
  event,
  { algorithmId, sourceId, userProvidedFilename },
) => {
  try {
    const { name: datasetName } = db
      .get(DATASETS_COLLECTION)
      .find({ id: sourceId })
      .value();
    const { name: algorithmName } = db
      .get(ALGORITHMS_COLLECTION)
      .find({ id: algorithmId })
      .value();

    // add execution
    const execution = {
      id: ObjectId().str,
      algorithm: { id: algorithmId },
      source: { id: sourceId },
      executedAt: Date.now(),
      status: EXECUTION_STATUSES.PENDING,
      result: {
        name: userProvidedFilename || `${datasetName}_${algorithmName}`,
      },
    };
    db.get(EXECUTIONS_COLLECTION).push(execution).write();
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

module.exports = createExecution;
