const logger = require('../logger');
const { SET_DATABASE_CHANNEL } = require('../config/channels');

const setDatabase = (mainWindow, db) => async (e, payload) => {
  try {
    db.setState(payload).write();
    const database = db.getState();

    mainWindow.webContents.send(SET_DATABASE_CHANNEL, database);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(SET_DATABASE_CHANNEL, null);
  }
};

module.exports = setDatabase;
