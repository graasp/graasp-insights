const ObjectId = require('bson-objectid');
const { CREATE_VALIDATION_CHANNEL } = require('../../shared/channels');
const {
  EXECUTION_STATUSES,
  VALIDATIONS_COLLECTION,
} = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  CREATE_VALIDATION_SUCCESS,
  CREATE_VALIDATION_ERROR,
} = require('../../shared/types');
const logger = require('../logger');

const createValidation = (mainWindow, db) => async (
  event,
  { sourceId, algorithms, schemaId },
) => {
  try {
    const validation = {
      id: ObjectId().str,
      executions: algorithms.map(({ id, name: algorithmName, parameters }) => {
        return {
          id: ObjectId().str,
          algorithmId: id,
          algorithmName,
          parameters,
          status: EXECUTION_STATUSES.PENDING,
          result: {},
        };
      }),
      source: { id: sourceId },
      verifiedAt: Date.now(),
      schemaId,
    };
    db.get(VALIDATIONS_COLLECTION).push(validation).write();
    mainWindow.webContents.send(CREATE_VALIDATION_CHANNEL, {
      type: CREATE_VALIDATION_SUCCESS,
      payload: validation,
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
