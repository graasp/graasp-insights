const path = require('path');
const { spawn } = require('child_process');
const logger = require('../logger');

const executePythonScript = (event, args) => {
  const { scriptId } = args;
  logger.debug(`executing script with scriptId ${scriptId}`);
  logger.debug('expecting a file named copy_of_data.json to exist');
  logger.debug(__dirname);

  const process = spawn('python', [
    path.resolve(__dirname, '../../python.py'), // todo: this file should be a parameter
    'copy_of_data.json', // todo: this file path/name should be imported from global state (the file chosen for anonymizing)
  ]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });
};

module.exports = executePythonScript;
