const Ajv = require('ajv');
const { SCHEMAS_COLLECTION } = require('../db');

const ajv = new Ajv();

const validateSchema = (json, schema) => {
  const validator = ajv.compile(schema);
  return validator(json);
};

const detectSchemas = (json, db) => {
  const schemas = db.get(SCHEMAS_COLLECTION).value();
  const validSchemas = Object.values(schemas)
    .filter(({ schema }) => {
      return validateSchema(json, schema);
    })
    .map(({ id }) => id);

  return validSchemas;
};

module.exports = { validateSchema, detectSchemas };
