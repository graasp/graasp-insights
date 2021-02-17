// eslint-disable-next-line import/no-extraneous-dependencies
const { shell } = require('electron');
const logger = require('../logger');

const openUrlInBrowser = () => (event, url) => {
  logger.debug(`opening url ${url} in browser`);
  shell.openExternal(url);
};

module.exports = openUrlInBrowser;
