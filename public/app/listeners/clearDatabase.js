const fs = require('fs');
const logger = require('../logger');
const { CLEAR_DATABASE_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const { ALGORITHMS_FOLDER, DATASETS_FOLDER } = require('../config/paths.js');
const {
  CLEAR_DATABASE_ERROR,
  CLEAR_DATABASE_SUCCESS,
} = require('../../shared/types');
const {
  EXECUTIONS_COLLECTION,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../../shared/constants');
const { bootstrapDatabase } = require('../db');

const clearDatabaseUtil = (db) => {
  logger.debug('clear database');

  db.get(ALGORITHMS_COLLECTION).remove().write();
  db.get(DATASETS_COLLECTION).remove().write();
  db.get(EXECUTIONS_COLLECTION).remove().write();
  // unset schemas since it is an object
  db.set(SCHEMAS_COLLECTION, {}).write();

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
