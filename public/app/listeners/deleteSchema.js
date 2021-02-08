const { DELETE_SCHEMA_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DELETE_SCHEMA_SUCCESS,
  DELETE_SCHEMA_ERROR,
} = require('../../shared/types');
const { SCHEMAS_COLLECTION, DATASETS_COLLECTION } = require('../db');

const deleteSchema = (mainWindow, db) => async (event, { id }) => {
  try {
    // delete schema
    db.get(SCHEMAS_COLLECTION).unset(id).write();

    // remove schema id from every dataset
    db.get(DATASETS_COLLECTION)
      .value()
      .forEach(({ id: dId, schemaIds }) => {
        if (schemaIds?.includes(id)) {
          db.get(DATASETS_COLLECTION)
            .find({ id: dId })
            .assign({
              schemaIds: schemaIds.filter((schemaId) => schemaId !== id),
            })
            .write();
        }
      });

    mainWindow.webContents.send(DELETE_SCHEMA_CHANNEL, {
      type: DELETE_SCHEMA_SUCCESS,
      payload: { id },
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(DELETE_SCHEMA_CHANNEL, {
      type: DELETE_SCHEMA_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteSchema;
