const { DATASETS_COLLECTION } = require('../db');
const { GET_DATASETS_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const getDatasets = (mainWindow, db) => async () => {
  try {
    const datasets = db.get(DATASETS_COLLECTION).value();
    mainWindow.webContents.send(GET_DATASETS_CHANNEL, datasets);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_DATASETS_CHANNEL, null);
  }
};

module.exports = getDatasets;
