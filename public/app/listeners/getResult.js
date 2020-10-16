const fs = require('fs');
const { GET_RESULT_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { RESULTS_COLLECTION } = require('../db');

const getResult = (mainWindow, db) => async (event, { id }) => {
  try {
    // get result from local db
    const result = db.get(RESULTS_COLLECTION).find({ id }).value();

    let content = null;
    const { filepath } = result;
    content = fs.readFileSync(filepath, 'utf8');

    mainWindow.webContents.send(GET_RESULT_CHANNEL, { ...result, content });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
    }
    logger.error(err);
    mainWindow.webContents.send(GET_RESULT_CHANNEL, null);
  }
};

module.exports = getResult;
