const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { RESULTS_FOLDER } = require('../config/config');
const { createNewDataset } = require('./loadDataset');
const { DATASETS_COLLECTION, RESULTS_COLLECTION } = require('../db');

const createNewResultDataset = ({
  name,
  filepath,
  algorithmId,
  description,
}) => {
  const result = createNewDataset({
    name,
    filepath,
    folderPath: RESULTS_FOLDER,
    description,
  });
  result.algorithmId = algorithmId;
  return result;
};

const executePythonAlgorithm = (mainWindow, db) => (event, { datasetId }) => {
  // get corresponding dataset
  const { filepath, name: datasetName, description } = db
    .get(DATASETS_COLLECTION)
    .find({ id: datasetId })
    .value();

  const id = ObjectId().str;
  const outputPath = path.join(RESULTS_FOLDER, `${id}.json`);

  const process = spawn('python', [
    path.resolve(__dirname, '../../python.py'), // todo: this file should be a parameter
    filepath,
    outputPath, // todo: this file should be named based on the original file name and script run
  ]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });

  process.stderr.on('data', (data) => {
    logger.error(data.toString());
  });

  process.on('close', (code) => {
    if (code !== 0) {
      logger.error(`python process exited with code ${code}`);
    } else {
      // save result in db
      const newDataset = createNewResultDataset({
        name: `hashed_${datasetName}`, // todo: change name depending on algorithm?
        filepath: outputPath,
        algorithmId: '1', // todo: update depending on the algorithm
        description,
      });
      db.get(RESULTS_COLLECTION).push(newDataset).write();

      logger.debug(`save resulting dataset at ${newDataset.filepath}`);
    }

    // delete tmp file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });
};

module.exports = executePythonAlgorithm;
