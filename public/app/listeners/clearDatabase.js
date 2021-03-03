const fs = require('fs');
const logger = require('../logger');
const { CLEAR_DATABASE_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const { ALGORITHMS_FOLDER, DATASETS_FOLDER } = require('../config/paths.js');
const {
  CLEAR_DATABASE_ERROR,
  CLEAR_DATABASE_SUCCESS,
} = require('../../shared/types');
const sampleDatabase = require('../data/sample');
const { SETTINGS_COLLECTION } = require('../../shared/constants');
const { bootstrapDatabase } = require('../db');

const clearDatabaseUtil = (db) => {
  // keep settings
  const settings = db.get(SETTINGS_COLLECTION).value();

  // set data with necessary fields
  db.setState({ ...sampleDatabase, [SETTINGS_COLLECTION]: settings }).write();

  // remove files from folders
  fs.rmdirSync(ALGORITHMS_FOLDER, { recursive: true });
  fs.rmdirSync(DATASETS_FOLDER, { recursive: true });

  // ensure necessary data (utils)
  bootstrapDatabase();
};

const clearDatabase = (mainWindow, db) => () => {
  try {
    clearDatabaseUtil(db);

    mainWindow.webContents.send(CLEAR_DATABASE_CHANNEL, {
      type: CLEAR_DATABASE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(CLEAR_DATABASE_CHANNEL, {
      type: CLEAR_DATABASE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = { clearDatabase, clearDatabaseUtil };
