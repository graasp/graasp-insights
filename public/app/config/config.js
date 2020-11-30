// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const path = require('path');
const isWindows = require('../utils/isWindows');
const { ALGORITHM_TYPES } = require('../../shared/constants');

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
const RESULTS_FOLDER = `${VAR_FOLDER}/results`;
const ALGORITHMS_FOLDER = `${VAR_FOLDER}/algorithms`;
const SAMPLE_DATASET_FILEPATH = path.resolve(
  `${DATASETS_FOLDER}/sampleDataset.json`,
);
const ALGORITHMS_FOLDER_NAME = 'algorithms';
const PRODUCT_NAME = 'Graasp Insights';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';
const AUTHOR_GRAASP = 'Graasp';
const AUTHOR_USER = 'User';

const PROGRAMMING_LANGUAGES = {
  PYTHON: 'Python',
};

const GRAASP_ALGORITHMS = [
  {
    name: 'Hash users',
    description:
      "Hash the userId field from the 'actions' and 'appInstanceResources'",
    filename: 'hash_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'hash_users.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Sanitize users',
    description:
      'Scan the dataset for occurrences of user names and user IDs, and replace such occurrences with a hash of the corresponding user ID',
    filename: 'sanitize_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'sanitize_users.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Suppress geolocation',
    description: "Suppress the 'geolocation' field from the 'actions'",
    filename: 'suppress_geolocation.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_geolocation.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Suppress data',
    description: "Suppress the 'data' field from the 'actions'",
    filename: 'suppress_data.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_data.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Suppress users',
    description: "Suppress the 'users' field from a dataset",
    filename: 'suppress_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_users.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Suppress appInstances settings',
    description: "Suppress the 'settings' field from the 'appInstances'",
    filename: 'suppress_appInstances_settings.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_appInstances_settings.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: 'Suppress appInstancesResources data',
    description: "Suppress the 'data' field from the 'appInstanceResource'",
    filename: 'suppress_appInstanceResources_data.py',
    filepath: path.join(
      ALGORITHMS_FOLDER,
      'suppress_appInstanceResources_data.py',
    ),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    name: '2-Anonymize geolocation',
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least two users containing that combination.
      The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    filename: 'two_anonymize_geolocations.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'two_anonymize_geolocations.py'),
    author: AUTHOR_GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
];

const GRAASP_UTILS = {
  filename: 'graasp_utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'graasp_utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
};

const USER_UTILS = {
  filename: 'utils.py',
  filepath: path.join(ALGORITHMS_FOLDER, 'utils.py'),
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.UTILS,
  author: AUTHOR_USER,
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
  RESULTS_FOLDER,
  ALGORITHMS_FOLDER,
  GRAASP_ALGORITHMS,
  ALGORITHMS_FOLDER_NAME,
  escapeEscapeCharacter,
  ACCEPTED_PYTHON_VERSIONS,
  PROGRAMMING_LANGUAGES,
  AUTHOR_GRAASP,
  AUTHOR_USER,
  GRAASP_UTILS,
  USER_UTILS,
};
