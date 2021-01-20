// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const mkdirp = require('mkdirp');
const path = require('path');
const low = require('lowdb');
const fs = require('fs');
const fse = require('fs-extra');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('./logger');
const {
  ALGORITHMS_FOLDER_NAME,
  GRAASP_UTILS,
  USER_UTILS,
} = require('./config/config');
const { DEFAULT_SCHEMAS } = require('./schema/config');
const {
  DATABASE_PATH,
  DATASETS_FOLDER,
  ALGORITHMS_FOLDER,
  VAR_FOLDER,
} = require('./config/paths');
const GRAASP_ALGORITHMS = require('./config/graaspAlgorithms');
const { AUTHORS } = require('../shared/constants');

const DATASETS_COLLECTION = 'datasets';
const ALGORITHMS_COLLECTION = 'algorithms';
const EXECUTIONS_COLLECTION = 'executions';
const SETTINGS_COLLECTION = 'settings';
const SCHEMAS_COLLECTION = 'schemas';

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
  fse.ensureDirSync(DATASETS_FOLDER);

  // set some defaults (required if json file is empty)
  db.defaults({
    [DATASETS_COLLECTION]: [],
    [ALGORITHMS_COLLECTION]: [],
    [EXECUTIONS_COLLECTION]: [],
    [SETTINGS_COLLECTION]: {},
    [SCHEMAS_COLLECTION]: {},
  }).write();
  return db;
};

const ensureAlgorithmsExist = async (db) => {
  try {
    // create the algorithms folder if it doesn't already exist
    fse.ensureDirSync(ALGORITHMS_FOLDER);

    // compare version with last app's start
    const lastVersion = db.get('version').value();
    const currentVersion = app.getVersion();
    const isNewVersion = lastVersion !== currentVersion;

    // set default algorithms
    [...GRAASP_ALGORITHMS, GRAASP_UTILS, USER_UTILS].forEach((algo) => {
      const { filename } = algo;
      const srcPath = path.join(__dirname, ALGORITHMS_FOLDER_NAME, filename);
      const destPath = path.join(ALGORITHMS_FOLDER, filename);

      // on dev update files with most recent changes
      const isDevWithModification =
        !app.isPackaged &&
        (!fs.existsSync(destPath) ||
          fs.statSync(destPath).mtime < fs.statSync(srcPath).mtime);

      // on prod replace files on first start of new version
      const isProdWithNewVersion =
        app.isPackaged && algo.author === AUTHORS.GRAASP && isNewVersion;

      if (fs.existsSync(srcPath)) {
        // copy if file is not in algorithms folder
        // or depending on dev and prod env
        if (
          !fs.existsSync(destPath) ||
          isDevWithModification ||
          isProdWithNewVersion
        ) {
          fs.copyFileSync(srcPath, destPath);
        }

        // check if algo entry is in metadata db
        if (!db.get(ALGORITHMS_COLLECTION).find({ filename }).value()) {
          // get file data
          const stats = fs.statSync(destPath);
          const { size, ctimeMs, mtimeMs } = stats;
          const sizeInKiloBytes = size / 1000;
          const createdAt = ctimeMs;
          const lastModified = mtimeMs;

          db.get(ALGORITHMS_COLLECTION)
            .push({
              ...algo,
              filepath: destPath,
              createdAt,
              lastModified,
              size: sizeInKiloBytes,
            })
            .write();
        }
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

const addDefaultSchemas = async (db) => {
  Object.entries(DEFAULT_SCHEMAS).forEach(([id, schemaInfo]) => {
    if (!db.get(SCHEMAS_COLLECTION).has(id).value()) {
      const createdAt = Date.now();
      db.get(SCHEMAS_COLLECTION)
        .set(id, { ...schemaInfo, createdAt })
        .write();
    }
  });
};

module.exports = {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SETTINGS_COLLECTION,
  SCHEMAS_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
  ensureAlgorithmsExist,
  addDefaultSchemas,
};
