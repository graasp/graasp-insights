const fs = require('fs');
const { DELETE_RESULT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');
const {
  DATASETS_COLLECTION,
  EXECUTIONS_COLLECTION,
} = require('../../shared/constants');
const {
  DELETE_RESULT_SUCCESS,
  DELETE_RESULT_ERROR,
} = require('../../shared/types');
const { ERROR_GENERAL, ERROR_MISSING_FILE } = require('../../shared/errors');

const deleteResult = (mainWindow, db) => async (event, { id }) => {
  try {
    // get result from local db
    const result = db.get(DATASETS_COLLECTION).find({ id }).value();
    const { filepath, name } = result;

    // update related executions
    db.get(EXECUTIONS_COLLECTION)
      .filter(({ source: { id: sourceId } }) => sourceId === id)
      .each((exec) => {
        // eslint-disable-next-line no-param-reassign
        exec.source = { name };
      })
      .write();

    db.get(EXECUTIONS_COLLECTION)
      .filter(({ result: { id: resultId } }) => {
        return resultId === id;
      })
      .each((exec) => {
        // eslint-disable-next-line no-param-reassign
        exec.result = { name };
      })
      .write();

    // delete the db
    fs.unlinkSync(filepath);
    logger.debug(`Deleted the result ${name} with id ${id} at ${filepath}`);

    db.get(DATASETS_COLLECTION).remove({ id }).write();

    return mainWindow.webContents.send(DELETE_RESULT_CHANNEL, {
      type: DELETE_RESULT_SUCCESS,
      payload: id,
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.error('File not found!');
      return mainWindow.webContents.send(DELETE_RESULT_CHANNEL, {
        type: DELETE_RESULT_ERROR,
        error: ERROR_MISSING_FILE,
      });
    }
    logger.error(err);
    return mainWindow.webContents.send(DELETE_RESULT_CHANNEL, {
      type: DELETE_RESULT_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = deleteResult;
