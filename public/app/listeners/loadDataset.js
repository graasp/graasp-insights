const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');
const { DATASETS_COLLECTION } = require('../db');

const createNewDataset = ({ name, filepath, description }) => {
  // create and get file data
  const fileId = ObjectId().str;
  const destPath = path.join(DATASETS_FOLDER, `${fileId}.json`);

  // copy file
  fs.copyFileSync(filepath, destPath);

  // get file data
  const stats = fs.statSync(destPath);
  const { size, ctimeMs } = stats;
  const sizeInKiloBytes = size / 1000;
  const createdAt = ctimeMs;
  const lastModified = createdAt;

  return {
    id: fileId,
    name,
    filepath: destPath,
    description,
    size: sizeInKiloBytes,
    createdAt,
    lastModified,
  };
};

const loadDataset = (mainWindow, db) => async (event, args) => {
  const { fileLocation, fileDescription } = args;
  let { fileCustomName } = args;

  if (!fileCustomName) {
    // if no name is provided by user, use filename without extension
    fileCustomName = path
      .basename(fileLocation)
      .slice(0, -path.extname(fileLocation).length);
  }

  try {
    const newDataset = createNewDataset({
      name: fileCustomName,
      filepath: fileLocation,
      description: fileDescription,
    });
    logger.debug(`load dataset at ${newDataset.filepath}`);
    // save file in lowdb
    db.get(DATASETS_COLLECTION).push(newDataset).write();
  } catch (err) {
    logger.log(err);
  }
};

module.exports = { createNewDataset, loadDataset };
