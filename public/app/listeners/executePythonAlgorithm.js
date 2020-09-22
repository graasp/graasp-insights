const path = require('path');
const { spawn } = require('child_process');
const logger = require('../logger');

const executePythonAlgorithm = (event, args) => {
  // const { id } = args;

  const process = spawn('python', [
    path.resolve(__dirname, '../../python.py'), // todo: this file should be a parameter
    'copy_of_data.json', // todo: this file path/name should be imported from global state (the file chosen for anonymizing)
  ]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });
};

module.exports = executePythonAlgorithm;
