// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { BROWSE_FILE_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const browseFile = (mainWindow) => (event, options) => {
  logger.debug('showing browse file prompt');
  dialog.showOpenDialog(mainWindow, options).then(({ filePaths }) => {
    mainWindow.webContents.send(BROWSE_FILE_CHANNEL, filePaths);
  });
};

module.exports = browseFile;
