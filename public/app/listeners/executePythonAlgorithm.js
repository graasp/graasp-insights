const { spawn } = require('child_process');
const { PARAMETER_TYPES } = require('../../shared/constants');
const logger = require('../logger');

const buildCurrentTime = () => {
  return new Date().toLocaleString('en-US');
};

const buildLogLine = (text) => {
  return `${buildCurrentTime()}: ${text}\n`;
};

const executePythonAlgorithm = (
  { algorithmFilepath, filepath, tmpPath, parameters, schemaId },
  { onRun, onStop, onSuccess, onError, clean, onLog },
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
  let log = buildLogLine(`python ${args.join(' ')}`);
  // eslint-disable-next-line no-unused-expressions
  onLog?.({ log });

  const process = spawn('python', args);

  onRun({ pid: process.pid });

  process.stdout.on('data', (chunk) => {
    const textChunk = chunk.toString('utf8'); // buffer to string
    logger.debug(textChunk);
    log += buildLogLine(chunk);
    // eslint-disable-next-line no-unused-expressions
    onLog?.({ log });
  });

  process.stderr.on('data', (data) => {
    logger.error(data);
    log += buildLogLine(data);
    // eslint-disable-next-line no-unused-expressions
    onLog?.({ log });
  });

  process.on('close', (code) => {
    logger.error(`python process exited with code ${code}`);
    log += buildLogLine(`python process exited with code ${code}`);

    switch (code) {
      case 0:
        onSuccess({ log });
        break;
      // null = kill with tree kill
      case null:
        onStop();
        break;
      default:
        onError({ code, log });
    }
    clean();
  });
};

module.exports = executePythonAlgorithm;
