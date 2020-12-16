// eslint-disable-next-line import/no-extraneous-dependencies
const { shell } = require('electron'); // deconstructing assignment
const logger = require('../logger');

const openPathInExplorer = () => (event, path) => {
  logger.debug(`showing path ${path} in explorer`);
  shell.showItemInFolder(path); // Show the given file in a file manager. If possible, select the file.
};

module.exports = openPathInExplorer;
