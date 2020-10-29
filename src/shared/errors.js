// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const ERROR_GENERAL = 'ERROR_GENERAL';
const ERROR_MISSING_FILE = 'ERROR_FILE_DOES_NOT_EXIST';
const ERROR_PYTHON_PROCESS = 'ERROR_PYTHON_PROCESS';
const ERROR_PYTHON_UNSUPPORTED_VERSION = 'ERROR_PYTHON_UNSUPPORTED_VERSION';
const ERROR_PYTHON_NOT_INSTALLED = 'ERROR_PYTHON_NOT_INSTALLED';

module.exports = {
  ERROR_GENERAL,
  ERROR_MISSING_FILE,
  ERROR_PYTHON_PROCESS,
  ERROR_PYTHON_UNSUPPORTED_VERSION,
  ERROR_PYTHON_NOT_INSTALLED,
};