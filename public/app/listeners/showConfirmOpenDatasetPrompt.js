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
    message: `This dataset is ${formatFileSize(
      size,
    )} in size, and opening it might take time or slow down your device. Do you want to proceed?`,
    detail:
      'Tip: You can adjust the default maximum size for viewing datasets in your Settings tab.',
  };

  dialog.showMessageBox(mainWindow, options).then(({ response }) => {
    mainWindow.webContents.send(SHOW_CONFIRM_OPEN_DATASET_CHANNEL, response);
  });
};

module.exports = showConfirmOpenDatasetPrompt;
