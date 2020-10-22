// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const ERROR_GENERAL = 'ERROR_GENERAL';
const ERROR_MISSING_FILE = 'ERROR_FILE_DOES_NOT_EXIST';
const PYTHON_PROCESS_ERROR = 'PYTHON_PROCESS_ERROR';

module.exports = {
  ERROR_GENERAL,
  ERROR_MISSING_FILE,
  PYTHON_PROCESS_ERROR,
};
