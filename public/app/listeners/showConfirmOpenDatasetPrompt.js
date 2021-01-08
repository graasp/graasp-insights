// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const { formatFileSize } = require('../../shared/formatting');
const { SHOW_CONFIRM_OPEN_DATASET_CHANNEL } = require('../../shared/channels');
const logger = require('../logger');

const showConfirmOpenDatasetPrompt = (mainWindow) => (event, { size }) => {
  logger.debug('showing confirm open dataset prompt');

  const options = {
    type: 'warning',
    buttons: ['Cancel', 'Continue'],
    defaultId: 1,
    cancelId: 0,
    message: `This dataset's size is ${formatFileSize(
      size,
    )} and opening it might take time. Do you want to proceed?`,
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(SHOW_CONFIRM_OPEN_DATASET_CHANNEL, response);
  });
};

module.exports = showConfirmOpenDatasetPrompt;
