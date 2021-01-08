const path = require('path');
const { ALGORITHMS_FOLDER } = require('./paths');
const {
  ALGORITHM_TYPES,
  PROGRAMMING_LANGUAGES,
  AUTHORS,
  GRAASP_SCHEMA_ID,
} = require('../../shared/constants');
const GRAASP_SCHEMA = require('../schema/graasp');

const DEFAULT_LOGGING_LEVEL = 'info';
const DEFAULT_PROTOCOL = 'https';
const ALGORITHMS_FOLDER_NAME = 'algorithms';
const PRODUCT_NAME = 'Graasp Insights';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';

const GRAASP_UTILS = {
  id: 'graasp-utils',
  filename: 'graasp_utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'graasp_utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
  author: AUTHORS.GRAASP,
};

const USER_UTILS = {
  id: 'users-utils',
  filename: 'utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
  author: AUTHORS.USER,
};

const ACCEPTED_PYTHON_VERSIONS = ['2.7', '3'];

const DEFAULT_SCHEMAS = [
  {
    id: GRAASP_SCHEMA_ID,
    label: 'Graasp',
    schema: GRAASP_SCHEMA,
    tagStyle: {
      backgroundColor: '#5050d2',
      color: 'white',
    },
  },
];

module.exports = {
  DEFAULT_LOGGING_LEVEL,
  DEFAULT_PROTOCOL,
  TMP_FOLDER,
  DEFAULT_LANG,
  PRODUCT_NAME,
  ALGORITHMS_FOLDER,
  ALGORITHMS_FOLDER_NAME,
  ACCEPTED_PYTHON_VERSIONS,
  GRAASP_UTILS,
  USER_UTILS,
  DEFAULT_SCHEMAS,
};
