const { ALGORITHMS_COLLECTION } = require('../db');
const { GET_ALGORITHMS_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const getAlgorithms = (mainWindow, db) => async () => {
  try {
    const algorithms = db.get(ALGORITHMS_COLLECTION).value();
    mainWindow.webContents.send(GET_ALGORITHMS_CHANNEL, algorithms);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_ALGORITHMS_CHANNEL, null);
  }
};

module.exports = getAlgorithms;
