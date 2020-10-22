// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron');
const {
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
} = require('../../shared/channels');
const logger = require('../logger');

const showLoadDatasetPrompt = (mainWindow) => () => {
  const options = { filters: [{ name: 'json', extensions: ['json'] }] };
  logger.debug('showing load dataset prompt');
  dialog.showOpenDialog(mainWindow, options).then(({ filePaths }) => {
    mainWindow.webContents.send(RESPOND_LOAD_DATASET_PROMPT_CHANNEL, filePaths);
  });
};

module.exports = showLoadDatasetPrompt;
