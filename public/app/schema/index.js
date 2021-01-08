const Ajv = require('ajv');
const GRAASP_SCHEMA = require('./graasp');
const { GRAASP_SCHEMA_ID } = require('../../shared/constants');

const ajv = new Ajv();

const graaspSchemaValidator = ajv.compile(GRAASP_SCHEMA);

const schemaValidators = [
  { id: GRAASP_SCHEMA_ID, validator: graaspSchemaValidator },
];

const detectSchema = (data) =>
  schemaValidators.find(({ validator }) => validator(data))?.id;

module.exports = {
  detectSchema,
};
