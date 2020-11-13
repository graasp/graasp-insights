const Ajv = require('ajv');
const GRAASP_SCHEMA = require('./graasp');

const ajv = new Ajv({ allErrors: true });

const validateSchema = (schemaValidator) => (data) => {
  const valid = schemaValidator(data);
  const error = ajv.errorsText(schemaValidator.errors);
  return { valid, error };
};

const graaspSchemaValidator = ajv.compile(GRAASP_SCHEMA);
const validateGraaspSchema = validateSchema(graaspSchemaValidator);

module.exports = {
  validateGraaspSchema,
};
