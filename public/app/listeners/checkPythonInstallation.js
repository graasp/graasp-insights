const { exec } = require('child_process');
const logger = require('../logger');
const { CHECK_PYTHON_INSTALLATION_CHANNEL } = require('../../shared/channels');
const {
  CHECK_PYTHON_INSTALLATION_SUCCESS,
  CHECK_PYTHON_INSTALLATION_ERROR,
  PYTHON_WRONG_VERSION_ERROR,
  PYTHON_NOT_INSTALLED_ERROR,
} = require('../../shared/types');

const isPythonVersionValid = (version) => {
  // accept all python versions for now
  const parsedFormat = version.split('.').map(parseInt);
  return parsedFormat[0] === 2 || parsedFormat[0] === 3;
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
          error: PYTHON_WRONG_VERSION_ERROR,
          payload,
        });
      }
    });

    process.stderr.on('data', (data) => {
      logger.error(data.toString());
    });

    process.on('close', (code) => {
      if (code !== 0) {
        logger.error(`python process exited with code ${code}`);
        mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
          type: CHECK_PYTHON_INSTALLATION_ERROR,
          error: PYTHON_NOT_INSTALLED_ERROR,
          payload: { valid: false },
        });
      }
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(CHECK_PYTHON_INSTALLATION_CHANNEL, {
      type: CHECK_PYTHON_INSTALLATION_ERROR,
      error: PYTHON_NOT_INSTALLED_ERROR,
      payload: { valid: false },
    });
  }
};

module.exports = checkPythonInstallation;
