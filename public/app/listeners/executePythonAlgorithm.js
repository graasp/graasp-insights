const { spawn } = require('child_process');
const { PARAMETER_TYPES } = require('../../shared/constants');
const logger = require('../logger');

const executePythonAlgorithm = (
  { algorithmFilepath, filepath, tmpPath, parameters },
  { onRun, onStop, onSuccess, onError, clean },
) => {
  let errorLog = '';

  // for each parameter, prepares a pair [--parameter_name, parameter_value] for the command line
  const preparedParameters =
    parameters
      ?.map(({ name, type, value }) => {
        switch (type) {
          case PARAMETER_TYPES.FLOAT_INPUT:
          case PARAMETER_TYPES.INTEGER_INPUT:
            return [`--${name}`, Number(value)];
          case PARAMETER_TYPES.STRING_INPUT:
            return [`--${name}`, value];
          case PARAMETER_TYPES.FIELD_SELECTOR:
            return [`--${name}`, `${JSON.stringify(value)}`];
          default:
            return [];
        }
      })
      .flat() || [];

  const process = spawn(
    'python',
    [algorithmFilepath, filepath, tmpPath, ...preparedParameters],
    {
      maxBuffer: 10486750,
    },
  );

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
