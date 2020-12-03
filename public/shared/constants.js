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

const SCHEMA_TYPES = {
  GRAASP: 'GRAASP',
  NONE: 'NONE',
};

const AUTHOR_GRAASP = 'Graasp';
const AUTHOR_USER = 'User';

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
  SCHEMA_TYPES,
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  DATASET_TYPES,
  AUTHOR_GRAASP,
  AUTHOR_USER,
  EXECUTION_NAME_MAX_LENGTH,
};
