const path = require('path');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const XLSX = require('xlsx');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/paths');
const { ERROR_GENERAL } = require('../../shared/errors');
const { LOAD_DATASET_CHANNEL } = require('../../shared/channels');
const {
  LOAD_DATASET_SUCCESS,
  LOAD_DATASET_ERROR,
} = require('../../shared/types');
const {
  DATASET_TYPES,
  DATASETS_COLLECTION,
  FILE_FORMATS,
} = require('../../shared/constants');
const { ARRAY_OF_JSON_SCHEMA } = require('../schema/config');
const { detectSchemas, validateSchema } = require('../schema/detectSchemas');
const { getFileStats, convertCSVToJSON } = require('../utils/file');

const createNewDataset = ({ name, filepath, description, type }, db) => {
  // create and get file data
  const fileId = ObjectId().str;
  const destPath = path.join(DATASETS_FOLDER, `${fileId}.json`);
  switch (path.extname(filepath)) {
    case `.${FILE_FORMATS.CSV}`: {
      // convert from csv to json
      const csvContent = fs.readFileSync(filepath);
      const converted = convertCSVToJSON(csvContent);
      const stringified = JSON.stringify(converted);
      fs.writeFileSync(destPath, stringified);
      break;
    }
    case `.${FILE_FORMATS.XLSX}`: {
      const {
        Sheets,
        SheetNames: [sheetname],
      } = XLSX.readFile(filepath);
      const converted = XLSX.utils.sheet_to_json(Sheets[sheetname]);
      const stringified = JSON.stringify(converted);
      fs.writeFileSync(destPath, stringified);
      break;
    }
    case `.${FILE_FORMATS.JSON}`:
    default:
      // copy file
      fs.copyFileSync(filepath, destPath);
      break;
  }

  let schemaIds;
  let isTabular;
  try {
    const content = fs.readFileSync(destPath, 'utf8');
    const jsonContent = JSON.parse(content);
    schemaIds = detectSchemas(jsonContent, db) || [];

    isTabular = validateSchema(jsonContent, ARRAY_OF_JSON_SCHEMA);
  } catch {
    schemaIds = [];
    isTabular = false;
  }

  const { createdAt, lastModified, sizeInKiloBytes } = getFileStats(filepath);

  return {
    id: fileId,
    name,
    filepath: destPath,
    description,
    size: sizeInKiloBytes,
    createdAt,
    lastModified,
    schemaIds,
    type,
    originId: fileId,
    isTabular,
  };
};

const loadDataset = (mainWindow, db) => async (event, args) => {
  const { fileLocation, fileCustomName, fileDescription } = args;

  if (fs.existsSync(fileLocation)) {
    try {
      const newDataset = createNewDataset(
        {
          name: fileCustomName,
          filepath: fileLocation,
          description: fileDescription,
          folderPath: DATASETS_FOLDER,
          type: DATASET_TYPES.SOURCE,
        },
        db,
      );
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
