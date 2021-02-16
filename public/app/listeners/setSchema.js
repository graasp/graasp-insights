const fs = require('fs');
const ObjectId = require('bson-objectid');
const { SET_SCHEMA_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../../shared/errors');
const { SET_SCHEMA_SUCCESS, SET_SCHEMA_ERROR } = require('../../shared/types');
const { DATASETS_COLLECTION, SCHEMAS_COLLECTION } = require('../db');
const generateSchemaFromJSON = require('../schema/generateSchemaFromJSON');
const { validateSchema } = require('../schema/detectSchemas');

const setSchema = (mainWindow, db) => async (event, schema) => {
  try {
    const { label, description, tagStyle, fromDataset } = schema;
    let { id, schema: schemaDef, createdAt } = schema;

    if (!id) {
      id = ObjectId().str;
    }
    if (!createdAt) {
      createdAt = Date.now();
    }

    const lastModified = Date.now();

    if (fromDataset) {
      // generate schema from dataset
      const dataset = db
        .get(DATASETS_COLLECTION)
        .find({ id: fromDataset })
        .value();
      const { filepath } = dataset;
      const content = fs.readFileSync(filepath, 'utf8');
      const json = JSON.parse(content);
      schemaDef = generateSchemaFromJSON(json);
    } else if (!schemaDef) {
      schemaDef = { type: 'object', required: [], properties: {} };
    }

    // check for all datasets if they satisfy the schema
    const datasets = db.get(DATASETS_COLLECTION).value();
    datasets.forEach(({ filepath, schemaIds: schemaIdsPrev }, idx) => {
      const content = fs.readFileSync(filepath, 'utf8');
      const json = JSON.parse(content);
      const satisfiesSchema = validateSchema(json, schemaDef);
      let schemaIds = schemaIdsPrev || [];

      if (satisfiesSchema && !schemaIdsPrev?.includes(id)) {
        // add schema id to schemaIds
        schemaIds.push(id);
      } else if (!satisfiesSchema && schemaIdsPrev?.includes(id)) {
        // remove schema id from schemaIds
        schemaIds = schemaIds.filter((sId) => sId !== id);
      }
      db.get(DATASETS_COLLECTION).nth(idx).assign({ schemaIds }).write();
    });

    const schemaToStore = {
      id,
      label,
      description,
      tagStyle,
      schema: schemaDef,
      createdAt,
      lastModified,
    };

    db.get(SCHEMAS_COLLECTION).set(id, schemaToStore).write();
    mainWindow.webContents.send(SET_SCHEMA_CHANNEL, {
      type: SET_SCHEMA_SUCCESS,
      payload: schemaToStore,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_SCHEMA_CHANNEL, {
      type: SET_SCHEMA_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setSchema;
