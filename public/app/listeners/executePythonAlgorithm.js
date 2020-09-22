const path = require('path');
const { spawn } = require('child_process');
const logger = require('../logger');
const { VAR_FOLDER } = require('../config/config');

const executePythonAlgorithm = () => {
  const process = spawn('python', [
    path.resolve(__dirname, '../../python.py'), // todo: this file should be a parameter
    'copy_of_data.json', // todo: this file path/name should be imported from global state (the file chosen for anonymizing)
    `${VAR_FOLDER}/anonymized_data.json`, // todo: this file should be named based on the original file name and script run
  ]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });
};

module.exports = executePythonAlgorithm;