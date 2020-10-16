const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const logger = require('../logger');
const {
  DATASETS_FOLDER,
  RESULTS_FOLDER,
  SAMPLE_DATASET_FILEPATH,
} = require('../config/config');
const { SET_SAMPLE_DATABASE_CHANNEL } = require('../config/channels');
const sampleDatabase = require('../data/sample');

const setSampleDatabase = (mainWindow, db) => async () => {
  try {
    db.setState(_.cloneDeep(sampleDatabase)).write();
    fs.emptyDirSync(DATASETS_FOLDER);
    fs.emptyDirSync(RESULTS_FOLDER);

    fs.copyFileSync(
      path.join(__dirname, '../data/sampleDataset.json'),
      SAMPLE_DATASET_FILEPATH,
    );
    const database = db.getState();

    mainWindow.webContents.send(SET_SAMPLE_DATABASE_CHANNEL, database);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(SET_SAMPLE_DATABASE_CHANNEL, null);
  }
};

module.exports = setSampleDatabase;
