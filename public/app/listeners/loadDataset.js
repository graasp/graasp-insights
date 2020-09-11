const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');
const { DATASETS_COLLECTION } = require('../db');

const loadDataset = (mainWindow, db) => async (event, args) => {
  const { fileLocation } = args;
  const filename = path.basename(fileLocation);
  const filepath = path.join(DATASETS_FOLDER, filename);

  try {
    fs.copyFileSync(fileLocation, filepath);

    logger.debug(`load dataset at ${filepath}`);

    // create and get file data
    const id = ObjectId().str;
    const stats = fs.statSync(filepath);
    const { size } = stats;
    const createdAt = Date.now();
    const lastModified = createdAt;

    // save file in lowdb
    db.get(DATASETS_COLLECTION)
      .push({
        id,
        name: filename,
        filepath,
        size,
        createdAt,
        lastModified,
      })
      .write();
  } catch (err) {
    logger.log(err);
  }
};

module.exports = loadDataset;
