const fs = require('fs');
const logger = require('../logger');
const { DELETE_ALL_CHANNEL } = require('../../shared/channels');
const {
  EXECUTIONS_COLLECTION,
  ALGORITHMS_COLLECTION,
  DATASETS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../db');
const { ERROR_GENERAL } = require('../../shared/errors');
const { ALGORITHMS_FOLDER, DATASETS_FOLDER } = require('../config/paths.js');
const { DELETE_ALL_ERROR, DELETE_ALL_SUCCESS } = require('../../shared/types');

const deleteAll = (mainWindow, db) => () => {
  try {
    db.get(DATASETS_COLLECTION).remove().write();
    db.unset(SCHEMAS_COLLECTION).write();
    db.get(ALGORITHMS_COLLECTION).remove().write();
    db.get(EXECUTIONS_COLLECTION).remove().write();
    fs.rmdirSync(ALGORITHMS_FOLDER, { recursive: true });
    fs.rmdirSync(DATASETS_FOLDER, { recursive: true });
    mainWindow.webContents.send(DELETE_ALL_CHANNEL, {
      type: DELETE_ALL_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(DELETE_ALL_CHANNEL, {
      type: DELETE_ALL_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteAll;
