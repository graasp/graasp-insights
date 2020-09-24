// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const path = require('path');
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
const SAMPLE_DATASET_FILEPATH = path.resolve(
  `${DATASETS_FOLDER}/sampleDataset.json`,
);
const PRODUCT_NAME = 'Graasp Insights';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';

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
  escapeEscapeCharacter,
};
