const fs = require('fs');
const logger = require('../logger');
const { CLEAR_DATABASE_CHANNEL } = require('../../shared/channels');
const {
  EXECUTIONS_COLLECTION,
  ALGORITHMS_COLLECTION,
  DATASETS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../db');
const { ERROR_GENERAL } = require('../../shared/errors');
const { ALGORITHMS_FOLDER, DATASETS_FOLDER } = require('../config/paths.js');
const {
  CLEAR_DATABASE_ERROR,
  CLEAR_DATABASE_SUCCESS,
} = require('../../shared/types');

const clearDatabase = (mainWindow, db) => () => {
  try {
    db.get(DATASETS_COLLECTION).remove().write();
    db.unset(SCHEMAS_COLLECTION).write();
    db.get(ALGORITHMS_COLLECTION).remove().write();
    db.get(EXECUTIONS_COLLECTION).remove().write();
    fs.rmdirSync(ALGORITHMS_FOLDER, { recursive: true });
    fs.rmdirSync(DATASETS_FOLDER, { recursive: true });
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

module.exports = clearDatabase;
