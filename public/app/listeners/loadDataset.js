const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../../shared/errors');
const { DATASETS_COLLECTION } = require('../db');
const { LOAD_DATASET_CHANNEL } = require('../../shared/channels');
const {
  LOAD_DATASET_SUCCESS,
  LOAD_DATASET_ERROR,
} = require('../../shared/types');

const createNewDataset = ({ name, filepath, description, folderPath }) => {
  // create and get file data
  const fileId = ObjectId().str;
  const destPath = path.join(folderPath, `${fileId}.json`);

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
  const { fileLocation, fileCustomName, fileDescription } = args;
  const defaultFileName = path
    .basename(fileLocation)
    .slice(0, -path.extname(fileLocation).length);
  const fileName = fileCustomName || defaultFileName;

  if (fs.existsSync(fileLocation)) {
    try {
      const newDataset = createNewDataset({
        name: fileName,
        filepath: fileLocation,
        description: fileDescription,
        folderPath: DATASETS_FOLDER,
      });
      logger.debug(`load dataset at ${newDataset.filepath}`);
      // save file in lowdb
      db.get(DATASETS_COLLECTION).push(newDataset).write();
      // send message with created dataset
      mainWindow.webContents.send(LOAD_DATASET_CHANNEL, {
        type: LOAD_DATASET_SUCCESS,
        payload: newDataset,
      });
    } catch (err) {
      logger.log(err);
      mainWindow.webContents.send(LOAD_DATASET_CHANNEL, {
        type: LOAD_DATASET_ERROR,
        error: ERROR_GENERAL,
      });
    }
  } else {
    // empty message will be read by /actions/dataset.js as !dataset, and hence trigger an error
    mainWindow.webContents.send(LOAD_DATASET_CHANNEL, {
      type: LOAD_DATASET_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = { createNewDataset, loadDataset };
