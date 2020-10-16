const mkdirp = require('mkdirp');
const low = require('lowdb');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');
const {
  DATABASE_PATH,
  DATASETS_FOLDER,
  RESULTS_FOLDER,
  VAR_FOLDER,
} = require('./config/config');

const DATASETS_COLLECTION = 'datasets';
const RESULTS_COLLECTION = 'results';

// use promisified fs
const fsPromises = fs.promises;

// bootstrap database
const ensureDatabaseExists = async (dbPath = DATABASE_PATH) => {
  try {
    await fsPromises.readFile(dbPath, { encoding: 'utf8' });
  } catch (readErr) {
    logger.error(readErr);
    try {
      mkdirp.sync(VAR_FOLDER);
      await fsPromises.writeFile(dbPath, '');
    } catch (writeErr) {
      logger.error(writeErr);
    }
  }
};

const bootstrapDatabase = (dbPath = DATABASE_PATH) => {
  const adapter = new FileSync(dbPath);
  const db = low(adapter);

  // create the datasets folder if it doesn't already exist
  if (!fs.existsSync(DATASETS_FOLDER)) {
    mkdirp(DATASETS_FOLDER);
  }

  // create the results folder if it doesn't already exist
  if (!fs.existsSync(RESULTS_FOLDER)) {
    mkdirp(RESULTS_FOLDER);
  }

  // set some defaults (required if json file is empty)
  db.defaults({
    [DATASETS_COLLECTION]: [],
    [RESULTS_COLLECTION]: [],
  }).write();
  return db;
};

module.exports = {
  DATASETS_COLLECTION,
  RESULTS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
};
