const logger = require('../logger');
const { SET_GRAASP_DATABASE_CHANNEL } = require('../../shared/channels');
const {
  SET_GRAASP_DATABASE_SUCCESS,
  SET_GRAASP_DATABASE_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');
const { saveDefaultAlgorithmInDb } = require('./addDefaultAlgorithm');
const GRAASP_ALGORITHMS = require('../../shared/data/graaspAlgorithms');
const { DEFAULT_SCHEMAS } = require('../schema/config');
const { saveSchemaInDb } = require('./setSchema');

const setGraaspDatabase = (mainWindow, db) => async () => {
  logger.debug('set graasp database');
  try {
    // add algorithm one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const algo of GRAASP_ALGORITHMS) {
      saveDefaultAlgorithmInDb(algo, db);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const schema of Object.values(DEFAULT_SCHEMAS)) {
      saveSchemaInDb(schema, db);
    }

    const database = db.getState();

    mainWindow.webContents.send(SET_GRAASP_DATABASE_CHANNEL, {
      type: SET_GRAASP_DATABASE_SUCCESS,
      payload: database,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(SET_GRAASP_DATABASE_CHANNEL, {
      type: SET_GRAASP_DATABASE_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = setGraaspDatabase;
