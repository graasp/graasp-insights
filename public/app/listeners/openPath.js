// eslint-disable-next-line import/no-extraneous-dependencies
const { shell } = require('electron'); // deconstructing assignment
const path = require('path');
const logger = require('../logger');

const openPath = () => (event, location) => {
  logger.debug(`showing path ${location} externally`);
  // path.resolve necessary for windows location path
  // Show a folder in file explorer, open a file with default application
  shell.openExternal(`file://${path.resolve(location)}`);
};

module.exports = openPath;
