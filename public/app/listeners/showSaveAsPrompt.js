// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { SHOW_SAVE_AS_PROMPT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const showExportSpacePrompt = (mainWindow) => (event, filename) => {
  logger.debug('showing save as prompt');
  const options = {
    title: 'Save As',
    defaultPath: filename,
  };
  dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
    mainWindow.webContents.send(SHOW_SAVE_AS_PROMPT_CHANNEL, filePath);
  });
};

module.exports = showExportSpacePrompt;
