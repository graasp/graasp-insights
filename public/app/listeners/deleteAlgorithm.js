const fs = require('fs');
const { DELETE_ALGORITHM_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
} = require('../../shared/constants');
const { ERROR_GENERAL } = require('../../shared/errors');
const {
  DELETE_ALGORITHM_ERROR,
  DELETE_ALGORITHM_SUCCESS,
} = require('../../shared/types');

const deleteAlgorithm = (mainWindow, db) => async (event, { id }) => {
  try {
    // get algorithm from local db
    const algorithm = db.get(ALGORITHMS_COLLECTION).find({ id }).value();
    const { filepath, name, type } = algorithm;

    // update related executions
    db.get(EXECUTIONS_COLLECTION)
      .filter(({ algorithm: { id: algorithmId } }) => algorithmId === id)
      .each((exec) => {
        // eslint-disable-next-line no-param-reassign
        exec.algorithm = { name, type };
      })
      .write();

    // remove metadata entry
    db.get(ALGORITHMS_COLLECTION).remove({ id }).write();

    // delete the algorithm
    fs.unlinkSync(filepath);
    logger.debug(`Deleted the algorithm ${name} with id ${id} at ${filepath}`);

    mainWindow.webContents.send(DELETE_ALGORITHM_CHANNEL, {
      type: DELETE_ALGORITHM_SUCCESS,
      payload: id,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      // the file was already successfully deleted
      mainWindow.webContents.send(DELETE_ALGORITHM_CHANNEL, {
        type: DELETE_ALGORITHM_SUCCESS,
        payload: id,
      });
    } else {
      logger.error(err);
      mainWindow.webContents.send(DELETE_ALGORITHM_CHANNEL, {
        type: DELETE_ALGORITHM_ERROR,
        error: ERROR_GENERAL,
      });
    }
  }
};

module.exports = deleteAlgorithm;
