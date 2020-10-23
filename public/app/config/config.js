// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const path = require('path');
const ObjectId = require('bson-objectid');
const isWindows = require('../utils/isWindows');

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
const DEFAULT_AUTHOR = 'Graasp';

const PROGRAMMING_LANGUAGES = {
  PYTHON: 'Python',
};

const GRAASP_ALGORITHMS = [
  {
    id: ObjectId().str,
    name: 'Hash users',
    description:
      "Hash the userId field from the 'actions' and 'appInstanceResources'",
    filename: 'hash_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'hash_users.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Sanitize users',
    description:
      'Scan the dataset for occurrences of user names and user IDs, and replace such occurrences with a hash of the corresponding user ID',
    filename: 'sanitize_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'sanitize_users.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Suppress geolocation',
    description: "Suppress the 'geolocation' field from the 'actions'",
    filename: 'suppress_geolocation.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_geolocation.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Suppress data',
    description: "Suppress the 'data' field from the 'actions'",
    filename: 'suppress_data.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_data.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Suppress users',
    description: "Suppress the 'users' field from a dataset",
    filename: 'suppress_users.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_users.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Suppress appInstances settings',
    description: "Suppress the 'settings' field from the 'appInstances'",
    filename: 'suppress_appInstances_settings.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'suppress_appInstances_settings.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: 'Suppress appInstancesResources data',
    description: "Suppress the 'data' field from the 'appInstanceResource'",
    filename: 'suppress_appInstanceResources_data.py',
    filepath: path.join(
      ALGORITHMS_FOLDER,
      'suppress_appInstanceResources_data.py',
    ),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    id: ObjectId().str,
    name: '2-Anonymize geolocation',
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least two users containing that combination.
      The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    filename: 'two_anonymize_geolocations.py',
    filepath: path.join(ALGORITHMS_FOLDER, 'two_anonymize_geolocations.py'),
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
];

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
};
