const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const logger = require('../logger');
const {
  DATASETS_FOLDER,
  RESULTS_FOLDER,
  SAMPLE_DATASET_FILEPATH,
} = require('../config/config');
const { SET_SAMPLE_DATABASE_CHANNEL } = require('../../shared/channels');
const sampleDatabase = require('../data/sample');
const {
  SET_SAMPLE_DATABASE_SUCCESS,
  SET_SAMPLE_DATABASE_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

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

    mainWindow.webContents.send(SET_SAMPLE_DATABASE_CHANNEL, {
      type: SET_SAMPLE_DATABASE_SUCCESS,
      payload: database,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(SET_SAMPLE_DATABASE_CHANNEL, {
      type: SET_SAMPLE_DATABASE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setSampleDatabase;
