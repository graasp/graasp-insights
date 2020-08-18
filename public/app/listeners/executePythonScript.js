const path = require('path');
const { spawn } = require('child_process');
const logger = require('../logger');

const executePythonScript = () => {
  logger.debug('executing a python file');
  logger.debug(__dirname);

  const process = spawn('python', [
    path.resolve(__dirname, '../../python.py'), // todo: this file should be a parameter
    'hello',
  ]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string

    logger.debug(textChunk);
  });
};

module.exports = executePythonScript;
