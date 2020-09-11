const logger = require('../logger');

const setDatabase = (mainWindow, db) => async (e, { payload, channel }) => {
  try {
    db.setState(payload).write();
    const database = db.getState();

    mainWindow.webContents.send(channel, database);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(channel, null);
  }
};

module.exports = setDatabase;
