// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const ALGORITHM_TYPES = {
  ANONYMIZATION: 'anonymization',
  UTILS: 'utils',
  VISUALIZATION: 'visualization',
};

const APP_BACKGROUND_COLOR = '#F7F7F7';

const PROGRAMMING_LANGUAGES = {
  PYTHON: 'Python',
};

const AUTHORS = {
  GRAASP: 'Graasp',
  USER: 'User',
};

const PARAMETER_TYPES = {
  FIELD_SELECTOR: 'Field Selector',
  FLOAT_INPUT: 'Float',
  INTEGER_INPUT: 'Integer',
  STRING_INPUT: 'String',
};

const GRAASP_SCHEMA_ID = 'schema-graasp';

const EXECUTION_STATUSES = {
  PENDING: 'pending',
  RUNNING: 'running',
  ERROR: 'error',
  SUCCESS: 'success',
};

const DATASET_TYPES = {
  SOURCE: 'source',
  RESULT: 'result',
};

const EXECUTION_NAME_MAX_LENGTH = 25;

module.exports = {
  ALGORITHM_TYPES,
  APP_BACKGROUND_COLOR,
  AUTHORS,
  PARAMETER_TYPES,
  GRAASP_SCHEMA_ID,
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASET_TYPES,
  EXECUTION_NAME_MAX_LENGTH,
};
