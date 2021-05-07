// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const DATASETS_COLLECTION = 'datasets';
const ALGORITHMS_COLLECTION = 'algorithms';
const EXECUTIONS_COLLECTION = 'executions';
const SETTINGS_COLLECTION = 'settings';
const SCHEMAS_COLLECTION = 'schemas';
const PIPELINES_COLLECTION = 'pipelines';
const VALIDATIONS_COLLECTION = 'validations';

const ALGORITHM_TYPES = {
  ANONYMIZATION: 'Anonymization',
  UTILS: 'Utils',
  VISUALIZATION: 'Visualization',
  VALIDATION: 'Validation',
  PIPELINE: 'Pipeline',
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

const VALIDATION_STATUSES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  FAILURE: 'failure',
};

const DATASET_TYPES = {
  SOURCE: 'source',
  RESULT: 'result',
};

const EXECUTION_NAME_MAX_LENGTH = 25;

const FILE_SIZE_LIMIT_OPTIONS = [0, 500, 1000, 2500, 5000, 10000];
const DEFAULT_FILE_SIZE_LIMIT = FILE_SIZE_LIMIT_OPTIONS[2];

const FILE_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  XLSX: 'xlsx',
};

const EXPORT_FILE_FORMATS = [
  {
    name: 'JSON',
    format: FILE_FORMATS.JSON,
  },
  {
    name: 'CSV',
    format: FILE_FORMATS.CSV,
  },
];

const FILE_ENCODINGS = {
  UTF8: 'utf8',
};

module.exports = {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SETTINGS_COLLECTION,
  SCHEMAS_COLLECTION,
  PIPELINES_COLLECTION,
  VALIDATIONS_COLLECTION,
  ALGORITHM_TYPES,
  APP_BACKGROUND_COLOR,
  AUTHORS,
  PARAMETER_TYPES,
  GRAASP_SCHEMA_ID,
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
  DATASET_TYPES,
  EXECUTION_NAME_MAX_LENGTH,
  FILE_SIZE_LIMIT_OPTIONS,
  DEFAULT_FILE_SIZE_LIMIT,
  FILE_FORMATS,
  FILE_ENCODINGS,
  EXPORT_FILE_FORMATS,
};
