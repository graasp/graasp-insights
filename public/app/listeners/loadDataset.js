const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');
const { DATASETS_COLLECTION } = require('../db');

const createNewDataset = ({ name, filepath, fileId }) => {
  // create and get file data
  const stats = fs.statSync(filepath);
  const { size } = stats;
  const sizeInKiloBytes = size / 1000;
  const createdAt = Date.now();
  const lastModified = createdAt;
  return {
    id: fileId,
    name,
    filepath,
    size: sizeInKiloBytes,
    createdAt,
    lastModified,
  };
};

const loadDataset = (mainWindow, db) => async (event, args) => {
  const { fileLocation, id } = args;
  const fileId = id || ObjectId().str;
  const filename = path.basename(fileLocation);
  const extensionName = path.extname(filename);

  const filepath = path.join(DATASETS_FOLDER, fileId + extensionName);

  try {
    fs.copyFileSync(fileLocation, filepath);
    const newDataset = createNewDataset({ name: filename, filepath, fileId });
    logger.debug(`load dataset at ${filepath}`);

    // save file in lowdb
    db.get(DATASETS_COLLECTION).push(newDataset).write();
  } catch (err) {
    logger.log(err);
  }
};

module.exports = { createNewDataset, loadDataset };
