const fs = require('fs');
const logger = require('../logger');

const loadDataset = (event, args) => {
  const { fileLocation } = args;
  const newFileName = `copy_of_${fileLocation.substring(
    fileLocation.lastIndexOf('/') + 1,
  )}`;
  fs.copyFile(fileLocation, newFileName, (err) => {
    if (err) {
      logger.error(err);
    }
  });
};

module.exports = loadDataset;
