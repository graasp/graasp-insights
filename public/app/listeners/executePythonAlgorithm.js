const { spawn } = require('child_process');
const logger = require('../logger');

const executePythonAlgorithm = (
  { algorithmFilepath, filepath, tmpPath },
  onSuccess,
  onError,
  clean,
) => {
  const process = spawn('python', [algorithmFilepath, filepath, tmpPath]);

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      logger.error(`python process exited with code ${code}`);
      onError(code);
    } else {
      onSuccess();
    }

    clean();
  });
};

module.exports = executePythonAlgorithm;
