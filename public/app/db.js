// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const mkdirp = require('mkdirp');
const _ = require('lodash');
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
const {
  DATABASE_PATH,
  DATASETS_FOLDER,
  ALGORITHMS_FOLDER,
  VAR_FOLDER,
} = require('./config/paths');
const {
  AUTHORS,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SCHEMAS_COLLECTION,
  SETTINGS_COLLECTION,
  VALIDATIONS_COLLECTION,
  EXECUTION_STATUSES,
  PIPELINES_COLLECTION,
  DEFAULT_FILE_SIZE_LIMIT,
  FILE_ENCODINGS,
} = require('../shared/constants');
const { saveDefaultAlgorithmInDb } = require('./listeners/addDefaultAlgorithm');

// use promisified fs
const fsPromises = fs.promises;

const sampleDatabase = {
  [DATASETS_COLLECTION]: [],
  [ALGORITHMS_COLLECTION]: [],
  [EXECUTIONS_COLLECTION]: [],
  [SETTINGS_COLLECTION]: {
    fileSizeLimit: DEFAULT_FILE_SIZE_LIMIT,
  },
  [SCHEMAS_COLLECTION]: {},
  [PIPELINES_COLLECTION]: [],
  [VALIDATIONS_COLLECTION]: [],
};

// bootstrap database
const ensureDatabaseExists = async (dbPath = DATABASE_PATH) => {
  try {
    await fsPromises.readFile(dbPath, { encoding: FILE_ENCODINGS.UTF8 });
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

const ensureAlgorithmsExist = (db) => {
  try {
    // create the algorithms folder if it doesn't already exist
    fse.ensureDirSync(ALGORITHMS_FOLDER);

    // compare version with last app's start
    const lastVersion = db.get('version').value();
    const currentVersion = app.getVersion();
    const isNewVersion = lastVersion !== currentVersion;

    // set default algorithms
    [GRAASP_UTILS, USER_UTILS].forEach((algo) => {
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
          try {
            saveDefaultAlgorithmInDb(algo, db);
          } catch (e) {
            logger.error(e);
          }
        }
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

const ensureExecutionsStatus = (db) => {
  // running executions should be stopped
  const collection = db.get(EXECUTIONS_COLLECTION);
  const executions = collection
    .filter({ status: EXECUTION_STATUSES.RUNNING })
    .value();
  // eslint-disable-next-line no-restricted-syntax
  for (const { id } of executions) {
    collection
      .find({ id })
      .assign({ status: EXECUTION_STATUSES.ERROR })
      .write();
  }
};

const ensureDatabaseContent = (db) => {
  // create the necessary folders if they don't already exist
  fse.ensureDirSync(DATASETS_FOLDER);
  fse.ensureDirSync(ALGORITHMS_FOLDER);

  ensureAlgorithmsExist(db);
  ensureExecutionsStatus(db);

  // set version file in var folder
  // used to detect first install
  db.set('version', app.getVersion()).write();
};

const bootstrapDatabase = async (dbPath = DATABASE_PATH) => {
  await ensureDatabaseExists(DATABASE_PATH);
  const adapter = new FileSync(dbPath);
  const db = low(adapter);

  // set some defaults (required if json file is empty)
  db.defaults(_.cloneDeep(sampleDatabase)).write();

  ensureDatabaseContent(db);

  return db;
};

module.exports = {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SETTINGS_COLLECTION,
  SCHEMAS_COLLECTION,
  PIPELINES_COLLECTION,
  ensureDatabaseExists,
  bootstrapDatabase,
  ensureAlgorithmsExist,
  sampleDatabase,
  ensureDatabaseContent,
};
