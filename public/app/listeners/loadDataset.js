const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');
const { DATASETS_COLLECTION } = require('../db');

const createNewDataset = ({ id, name, filepath }) => {
  // create and get file data
  const fileId = id || ObjectId().str;
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
  const { fileLocation } = args;
  const filename = path.basename(fileLocation);
  const filepath = path.join(DATASETS_FOLDER, filename);

  try {
    fs.copyFileSync(fileLocation, filepath);
    const newDataset = createNewDataset({ name: filename, filepath });
    logger.debug(`load dataset at ${filepath}`);

    // save file in lowdb
    db.get(DATASETS_COLLECTION).push(newDataset).write();
  } catch (err) {
    logger.log(err);
  }
};

module.exports = { createNewDataset, loadDataset };
