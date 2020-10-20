const mkdirp = require('mkdirp');
const path = require('path');
const low = require('lowdb');
const fs = require('fs');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');
const {
  DATABASE_PATH,
  DATASETS_FOLDER,
  RESULTS_FOLDER,
  ALGORITHMS_FOLDER,
  VAR_FOLDER,
  GRAASP_ALGORITHMS,
  ALGORITHMS_FOLDER_NAME,
} = require('./config/config');

const DATASETS_COLLECTION = 'datasets';
const RESULTS_COLLECTION = 'results';
const ALGORITHMS_COLLECTION = 'algorithms';

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
    [ALGORITHMS_COLLECTION]: [],
    [RESULTS_COLLECTION]: [],
  }).write();
  return db;
};

const ensureAlgorithmsExist = async (
  db,
  algorithmsFolder = ALGORITHMS_FOLDER,
) => {
  // create the algorithms folder if it doesn't already exist
  if (!fs.existsSync(algorithmsFolder)) {
    await mkdirp(algorithmsFolder);
  }

  // set default algorithms
  GRAASP_ALGORITHMS.forEach((algo) => {
    const { filename } = algo;
    const srcPath = path.join(__dirname, ALGORITHMS_FOLDER_NAME, filename);
    const destPath = path.join(algorithmsFolder, filename);

    if (fs.existsSync(srcPath)) {
      // check if file is in algorithms folder
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }

      // check if algo entry is in metadata db
      if (!db.get(ALGORITHMS_COLLECTION).find({ filename }).value()) {
        db.get(ALGORITHMS_COLLECTION).push(algo).write();
      }
    }
  });
};

module.exports = {
  DATASETS_COLLECTION,
  RESULTS_COLLECTION,
  ALGORITHMS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
  ensureAlgorithmsExist,
};
