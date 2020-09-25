const fs = require('fs');
const { DELETE_DATASET_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../db');

const deleteDataset = (mainWindow, db) => async (event, { id }) => {
  try {
    // get dataset from local db
    const dataset = db.get(DATASETS_COLLECTION).find({ id }).value();
    const { filepath, name } = dataset;

    // delete the db
    fs.unlinkSync(filepath);
    logger.log(`Deleted the dataset ${name} with id ${id} at ${filepath}`);

    db.get(DATASETS_COLLECTION).remove({ id }).write();

    mainWindow.webContents.send(DELETE_DATASET_CHANNEL);
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
    }
    logger.error(err);
    mainWindow.webContents.send(DELETE_DATASET_CHANNEL);
  }
};

module.exports = deleteDataset;
