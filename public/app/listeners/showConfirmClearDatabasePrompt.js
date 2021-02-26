// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const {
  SHOW_CONFIRM_CLEAR_DATABASE_PROMPT_CHANNEL,
} = require('../../shared/channels');
const logger = require('../logger');

const showConfirmClearDatabasePrompt = (mainWindow) => () => {
  logger.debug('showing confirm prompt to delete all data in application');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0,
    message:
      'Are you sure you want to delete all of your datasets, schemas, algorithms, executions, and results? This action is irreversible.',
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(
      SHOW_CONFIRM_CLEAR_DATABASE_PROMPT_CHANNEL,
      response,
    );
  });
};

module.exports = showConfirmClearDatabasePrompt;
