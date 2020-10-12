const fs = require('fs');
const { DELETE_ALGORITHM_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ALGORITHMS_COLLECTION } = require('../db');

const deleteAlgorithm = (mainWindow, db) => async (event, { id }) => {
  try {
    // get algorithm from local db
    const algorithm = db.get(ALGORITHMS_COLLECTION).find({ id }).value();
    const { filepath, name } = algorithm;

    // delete the algorithm
    fs.unlinkSync(filepath);
    logger.debug(`Deleted the algorithm ${name} with id ${id} at ${filepath}`);

    // remove metadata entry
    db.get(ALGORITHMS_COLLECTION).remove({ id }).write();

    mainWindow.webContents.send(DELETE_ALGORITHM_CHANNEL);
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
    }
    logger.error(err);
    mainWindow.webContents.send(DELETE_ALGORITHM_CHANNEL);
  }
};

module.exports = deleteAlgorithm;
