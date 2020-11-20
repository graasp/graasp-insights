// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { SHOW_CONFIRM_DELETE_PROMPT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const showConfirmDeletePrompt = (mainWindow) => (event, { name }) => {
  logger.debug('showing confirm prompt');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0,
    message: `Are you sure you want to delete ${name}?`,
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, response);
  });
};

module.exports = showConfirmDeletePrompt;
