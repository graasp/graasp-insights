// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { SHOW_RESET_TEMPLATE_PROMPT_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const showResetTemplatePrompt = (mainWindow) => () => {
  logger.debug('showing confirm open dataset prompt');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Continue'],
    defaultId: 1,
    cancelId: 0,
    message: `The algorithm template will be reset and any changes will be lost. Do you confirm?`,
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(SHOW_RESET_TEMPLATE_PROMPT_CHANNEL, response);
  });
};

module.exports = showResetTemplatePrompt;
