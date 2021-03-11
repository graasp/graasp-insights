const { spawn } = require('child_process');
const { PARAMETER_TYPES } = require('../../shared/constants');
const logger = require('../logger');

const executePythonAlgorithm = (
  { algorithmFilepath, filepath, tmpPath, parameters, schemaId },
  { onRun, onStop, onSuccess, onError, clean },
) => {
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
          case PARAMETER_TYPES.FIELD_SELECTOR: {
            const fieldSelection = schemaId in value ? value[schemaId] : {};
            return [`--${name}`, `${JSON.stringify(fieldSelection)}`];
          }
          default:
            return [];
        }
      })
      .flat() || [];

  const args = [algorithmFilepath, filepath, tmpPath, ...preparedParameters];
  let log = `python ${args}`;

  const process = spawn('python', args);

  onRun({ pid: process.pid });

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
  });

  process.stderr.on('data', (data) => {
    logger.error(data);
    log += data;
  });

  process.on('close', (code) => {
    switch (code) {
      case 0:
        onSuccess({ log });
        break;
      // null = kill with tree kill
      case null:
        onStop();
        break;
      default:
        logger.error(`python process exited with code ${code}`);
        onError({ code, log });
    }
    clean();
  });
};

module.exports = executePythonAlgorithm;
