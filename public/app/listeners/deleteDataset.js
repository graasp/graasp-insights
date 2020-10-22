const fs = require('fs');
const { DELETE_DATASET_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../db');
const {
  DELETE_DATASET_SUCCESS,
  DELETE_DATASET_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL } = require('../../shared/errors');

const deleteDataset = (mainWindow, db) => async (event, { id }) => {
  try {
    // get dataset from local db
    const dataset = db.get(DATASETS_COLLECTION).find({ id }).value();
    const { filepath, name } = dataset;

    db.get(DATASETS_COLLECTION).remove({ id }).write();

    // delete the db
    fs.unlinkSync(filepath);
    logger.debug(`Deleted the dataset ${name} with id ${id} at ${filepath}`);

    return mainWindow.webContents.send(DELETE_DATASET_CHANNEL, {
      type: DELETE_DATASET_SUCCESS,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      // file is already deleted, return success
      return mainWindow.webContents.send(DELETE_DATASET_CHANNEL, {
        type: DELETE_DATASET_SUCCESS,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(DELETE_DATASET_CHANNEL, {
      type: DELETE_DATASET_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteDataset;
