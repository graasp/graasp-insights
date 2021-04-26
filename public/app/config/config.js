const path = require('path');
const { ALGORITHMS_FOLDER } = require('./paths');
const {
  ALGORITHM_TYPES,
  PROGRAMMING_LANGUAGES,
  AUTHORS,
} = require('../../shared/constants');

const DEFAULT_LOGGING_LEVEL = 'info';
const DEFAULT_PROTOCOL = 'https';
const ALGORITHMS_FOLDER_NAME = 'algorithms';
const PRODUCT_NAME = 'Graasp Insights';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';

const GRAASP_UTILS = {
  id: 'graasp-utils',
  name: 'graasp_utils',
  filename: 'graasp_utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'graasp_utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
  author: AUTHORS.GRAASP,
};

const USER_UTILS = {
  id: 'users-utils',
  name: 'utils',
  filename: 'utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
  author: AUTHORS.USER,
};

const ACCEPTED_PYTHON_VERSIONS = ['2.7', '3'];

const ALGORITHM_DATASET_PATH_NAME = 'dataset_path';
const ALGORITHM_OUTPUT_PATH_NAME = 'output_path';
const ALGORITHM_ORIGIN_PATH_NAME = 'origin_path';

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
  ALGORITHM_DATASET_PATH_NAME,
  ALGORITHM_OUTPUT_PATH_NAME,
  ALGORITHM_ORIGIN_PATH_NAME,
};
