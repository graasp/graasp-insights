const path = require('path');
const { spawn } = require('child_process');
const ObjectId = require('bson-objectid');
const logger = require('../logger');
const { DATASETS_FOLDER } = require('../config/config');

const executePythonAlgorithm = (mainWindow, db) => (event, { datasetId }) => {
  // get corresponding dataset
  const { filepath, name: datasetName } = db
    .get('datasets')
    .find({ id: datasetId })
    .value();

  const id = ObjectId().str;
  const outputPath = path.join(DATASETS_FOLDER, `${id}.json`);

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
      db.get('datasets')
        .push({
          id,
          name: `hashed_${datasetName}`,
          filepath: outputPath,
        })
        .write();
      logger.debug(`save resulting dataset at ${outputPath}`);
    }
  });
};

module.exports = executePythonAlgorithm;
