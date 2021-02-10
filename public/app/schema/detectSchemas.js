const Ajv = require('ajv');
const { SCHEMAS_COLLECTION } = require('../db');

const ajv = new Ajv();

const validateSchema = (json, schema) => {
  const validator = ajv.compile(schema);
  return validator(json);
};

const detectSchemas = (json, db) => {
  const validSchemas = db
    .get(SCHEMAS_COLLECTION)
    .filter(({ schema }) => validateSchema(json, schema))
    .map('id')
    .value();

  return validSchemas;
};

module.exports = { validateSchema, detectSchemas };
