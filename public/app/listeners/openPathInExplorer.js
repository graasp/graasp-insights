// eslint-disable-next-line import/no-extraneous-dependencies
const { shell } = require('electron'); // deconstructing assignment
const path = require('path');
const logger = require('../logger');

const openPathInExplorer = () => (event, location) => {
  logger.debug(`showing path ${location} in explorer`);
  // path.resolve necessary for windows location path
  shell.openExternal(`file://${path.resolve(location)}`); // Show the given file in a file manager. If possible, select the file.
};

module.exports = openPathInExplorer;
