const mkdirp = require('mkdirp');
const low = require('lowdb');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');
const { DATABASE_PATH, VAR_FOLDER } = require('./config/config');

// use promisified fs
const fsPromises = fs.promises;

// eslint-disable-next-line import/prefer-default-export
const DATASETS_COLLECTION = 'datasets';

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

  // set some defaults (required if json file is empty)
  db.defaults({ [DATASETS_COLLECTION]: [] }).write();
  return db;
};

module.exports = {
  DATASETS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
};
