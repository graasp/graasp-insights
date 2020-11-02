const { exec } = require('child_process');
const logger = require('../logger');
const { CHECK_PYTHON_INSTALLATION_CHANNEL } = require('../../shared/channels');
const {
  CHECK_PYTHON_INSTALLATION_SUCCESS,
  CHECK_PYTHON_INSTALLATION_ERROR,
} = require('../../shared/types');
const {
  ERROR_PYTHON_UNSUPPORTED_VERSION,
  ERROR_PYTHON_NOT_INSTALLED,
  ERROR_GENERAL,
} = require('../../shared/errors');
const { ACCEPTED_PYTHON_VERSIONS } = require('../config/config');

const isPythonVersionValid = (version) => {
  return ACCEPTED_PYTHON_VERSIONS.some((acceptedVersion) =>
    version.startsWith(acceptedVersion),
  );
};

const checkPythonInstallation = (mainWindow) => () => {
  try {
    const process = exec(
      'python -c "import platform; print(platform.python_version())"',
    );

    process.stdout.on('data', (chunk) => {
      const version = chunk.toString('utf8').replace(/\n$/, ''); // buffer to string without trailing new line
      const valid = isPythonVersionValid(version);
      const payload = { version, valid };

      if (valid) {
        mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
          type: CHECK_PYTHON_INSTALLATION_SUCCESS,
          payload,
        });
      } else {
        mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
          type: CHECK_PYTHON_INSTALLATION_ERROR,
          error: ERROR_PYTHON_UNSUPPORTED_VERSION,
          payload,
        });
      }
    });

    process.stderr.on('data', (data) => {
      logger.debug(data.toString());
    });

    process.on('close', (code) => {
      if (code !== 0) {
        logger.error(`python process exited with code ${code}`);
        mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
          type: CHECK_PYTHON_INSTALLATION_ERROR,
          error: ERROR_PYTHON_NOT_INSTALLED,
          payload: { valid: false },
        });
      }
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
      type: CHECK_PYTHON_INSTALLATION_ERROR,
      error: ERROR_GENERAL,
      payload: { valid: false },
    });
  }
};

module.exports = checkPythonInstallation;
