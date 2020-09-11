const fs = require('fs');
const { GET_DATASET_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { DATASETS_COLLECTION } = require('../db');

const getDataset = (mainWindow, db) => async (event, { id }) => {
  try {
    // get dataset from local db
    const dataset = db.get(DATASETS_COLLECTION).find({ id }).value();

    let content = null;
    const { filepath } = dataset;
    content = fs.readFileSync(filepath, 'utf8');

    mainWindow.webContents.send(GET_DATASET_CHANNEL, { ...dataset, content });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
    }
    logger.error(err);
    mainWindow.webContents.send(GET_DATASET_CHANNEL, null);
  }
};

module.exports = getDataset;
