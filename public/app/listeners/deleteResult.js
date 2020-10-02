const fs = require('fs');
const { DELETE_RESULT_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { RESULTS_COLLECTION } = require('../db');

const deleteResult = (mainWindow, db) => async (event, { id }) => {
  try {
    // get result from local db
    const result = db.get(RESULTS_COLLECTION).find({ id }).value();
    const { filepath, name } = result;

    // delete the db
    fs.unlinkSync(filepath);
    logger.debug(`Deleted the result ${name} with id ${id} at ${filepath}`);

    db.get(RESULTS_COLLECTION).remove({ id }).write();

    mainWindow.webContents.send(DELETE_RESULT_CHANNEL);
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
    }
    logger.error(err);
    mainWindow.webContents.send(DELETE_RESULT_CHANNEL);
  }
};

module.exports = deleteResult;
