const { RESULTS_COLLECTION } = require('../db');
const { GET_RESULTS_CHANNEL } = require('../config/channels');
const logger = require('../logger');

const getResults = (mainWindow, db) => async () => {
  try {
    const results = db.get(RESULTS_COLLECTION).value();
    mainWindow.webContents.send(GET_RESULTS_CHANNEL, results);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_RESULTS_CHANNEL, null);
  }
};

module.exports = getResults;
