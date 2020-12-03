const { spawn } = require('child_process');
const logger = require('../logger');

const executePythonAlgorithm = (
  { algorithmFilepath, filepath, tmpPath },
  { onRun, onStop, onSuccess, onError, clean },
) => {
  let errorLog = '';

  const process = spawn('python', [algorithmFilepath, filepath, tmpPath], {
    maxBuffer: 10486750,
  });

  onRun({ pid: process.pid });

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });

  process.stderr.on('data', (data) => {
    logger.error(data);
    errorLog += data;
  });

  process.on('close', (code) => {
    switch (code) {
      case 0:
        onSuccess();
        break;
      // null = kill with tree kill
      case null:
        onStop();
        break;
      default:
        logger.error(`python process exited with code ${code}`);
        onError({ code, log: errorLog });
    }
    clean();
  });
};

module.exports = executePythonAlgorithm;
