// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const path = require('path');
const isWindows = require('../utils/isWindows');
const {
  ALGORITHM_TYPES,
  PROGRAMMING_LANGUAGES,
  AUTHORS,
} = require('../../shared/constants');

// resolve path for windows '\'
const escapeEscapeCharacter = (str) => {
  return isWindows() ? str.replace(/\\/g, '\\\\') : str;
};

const DEFAULT_LOGGING_LEVEL = 'info';
const DEFAULT_PROTOCOL = 'https';
const VAR_FOLDER = `${escapeEscapeCharacter(app.getPath('userData'))}/var`;
const DATABASE_PATH = `${VAR_FOLDER}/db.json`;
const ICON_PATH = 'app/assets/icon.png';
const DATASETS_FOLDER = `${VAR_FOLDER}/datasets`;
const ALGORITHMS_FOLDER = `${VAR_FOLDER}/algorithms`;
const SAMPLE_DATASET_FILEPATH = path.resolve(
  `${DATASETS_FOLDER}/sampleDataset.json`,
);
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

module.exports = {
  DEFAULT_LOGGING_LEVEL,
  DATABASE_PATH,
  SAMPLE_DATASET_FILEPATH,
  DEFAULT_PROTOCOL,
  TMP_FOLDER,
  VAR_FOLDER,
  DEFAULT_LANG,
  ICON_PATH,
  PRODUCT_NAME,
  DATASETS_FOLDER,
  ALGORITHMS_FOLDER,
  ALGORITHMS_FOLDER_NAME,
  escapeEscapeCharacter,
  ACCEPTED_PYTHON_VERSIONS,
  GRAASP_UTILS,
  USER_UTILS,
};
