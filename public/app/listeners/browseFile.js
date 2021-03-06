// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { BROWSE_FILE_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const browseFile = (mainWindow) => (event, filters) => {
  logger.debug('showing browse file prompt');
  dialog.showOpenDialog(mainWindow, { filters }).then(({ filePaths }) => {
    mainWindow.webContents.send(BROWSE_FILE_CHANNEL, filePaths);
  });
};

module.exports = browseFile;
