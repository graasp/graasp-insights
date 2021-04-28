const ObjectId = require('bson-objectid');
const { CREATE_VALIDATION_CHANNEL } = require('../../shared/channels');
const { VALIDATIONS_COLLECTION } = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_VALIDATION_SUCCESS,
  CREATE_VALIDATION_ERROR,
} = require('../../shared/types');
const logger = require('../logger');
const { createExecutionInDb } = require('./createExecution');

const createValidation = (mainWindow, db) => async (
  event,
  { sourceId, algorithms, schemaId },
) => {
  try {
    const executions = algorithms.map(({ id: algorithmId, parameters, type }) =>
      createExecutionInDb(db, {
        algorithm: { id: algorithmId, type },
        source: { id: sourceId },
        result: {},
        parameters,
        schemaId,
      }),
    );

    const verifiedAt = Date.now();
    const validation = {
      id: ObjectId().str,
      executions: executions.map(({ id }) => id),
      source: { id: sourceId },
      verifiedAt,
    };
    db.get(VALIDATIONS_COLLECTION).push(validation).write();
    mainWindow.webContents.send(CREATE_VALIDATION_CHANNEL, {
      type: CREATE_VALIDATION_SUCCESS,
      payload: { validation, executions },
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(CREATE_VALIDATION_CHANNEL, {
      type: CREATE_VALIDATION_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = createValidation;
