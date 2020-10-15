const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { RESULTS_FOLDER } = require('../config/config');
const { createNewDataset } = require('./loadDataset');
const { DATASETS_COLLECTION, RESULTS_COLLECTION, ALGORITHMS_COLLECTION } = require('../db');
const { EXECUTE_PYTHON_ALGORITHM_CHANNEL } = require('../config/channels');

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

const executePythonAlgorithm = (mainWindow, db) => (
  event,
  { datasetId, algorithmId },
) => {
  // get corresponding dataset
  const { filepath, name: datasetName, description } = db
    .get(DATASETS_COLLECTION)
    .find({ id: datasetId })
    .value();

  // get the corresponding algorithm
  const { filepath: algorithmFilepath, name: algorithmName } = db
    .get(ALGORITHMS_COLLECTION)
    .find({ id: algorithmId })
    .value();

  const id = ObjectId().str;
  const tmpPath = path.join(RESULTS_FOLDER, `tmp_${id}.json`);

  const process = spawn('python', [algorithmFilepath, filepath, tmpPath]);

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
        name: `${datasetName}_${algorithmName}`,
        filepath: tmpPath,
        algorithmId: algorithmId,
        description,
      });
      db.get(RESULTS_COLLECTION).push(newDataset).write();

      logger.debug(`save resulting dataset at ${newDataset.filepath}`);

      mainWindow.webContents.send(EXECUTE_PYTHON_ALGORITHM_CHANNEL);
    }

    // delete tmp file
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  });
};

module.exports = executePythonAlgorithm;
