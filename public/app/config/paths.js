// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const path = require('path');

const VAR_FOLDER = path.join(app.getPath('userData'), 'var');
const DATABASE_PATH = `${VAR_FOLDER}/db.json`;
const ICON_PATH = 'app/assets/icon.png';
const DATASETS_FOLDER = `${VAR_FOLDER}/datasets`;
const ALGORITHMS_FOLDER = `${VAR_FOLDER}/algorithms`;
const SAMPLE_DATASET_FILEPATH = path.resolve(
  `${DATASETS_FOLDER}/sampleDataset.json`,
);

module.exports = {
  DATABASE_PATH,
  SAMPLE_DATASET_FILEPATH,
  VAR_FOLDER,
  ICON_PATH,
  DATASETS_FOLDER,
  ALGORITHMS_FOLDER,
};
