const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const logger = require('../logger');
const { CLEAR_DATABASE_CHANNEL } = require('../../shared/channels');
const { ERROR_GENERAL } = require('../../shared/errors');
const { VAR_FOLDER, DATABASE_PATH } = require('../config/paths.js');
const {
  CLEAR_DATABASE_ERROR,
  CLEAR_DATABASE_SUCCESS,
} = require('../../shared/types');
const { ensureDatabaseContent, sampleDatabase } = require('../db');

const clearDatabaseUtil = (db) => {
  logger.debug('clear database');

  // clear database
  db.setState(_.cloneDeep(sampleDatabase)).write();

  // remove all files in directory except database
  fs.readdirSync(VAR_FOLDER).forEach((file) => {
    const filepath = path.join(VAR_FOLDER, file);
    if (filepath !== DATABASE_PATH) {
      fs.rmdirSync(filepath, { recursive: true });
    }
  });

  // ensure the database contains necessary content
  ensureDatabaseContent(db);
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
