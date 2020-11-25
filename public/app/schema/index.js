const Ajv = require('ajv');
const GRAASP_SCHEMA = require('./graasp');
const { SCHEMA_TYPES } = require('../../shared/constants');

const ajv = new Ajv();

const validateSchema = (schemaValidator) => (data) => {
  const valid = schemaValidator(data);
  const error = ajv.errorsText(schemaValidator.errors);
  return { valid, error };
};

const graaspSchemaValidator = ajv.compile(GRAASP_SCHEMA);
const validateGraaspSchema = validateSchema(graaspSchemaValidator);

const schemaValidators = [
  { type: SCHEMA_TYPES.GRAASP, validator: graaspSchemaValidator },
];

const detectSchema = (data) => {
  return (
    schemaValidators.find(({ validator }) => validator(data))?.type ||
    SCHEMA_TYPES.NONE
  );
};

module.exports = {
  detectSchema,
  validateGraaspSchema,
};
