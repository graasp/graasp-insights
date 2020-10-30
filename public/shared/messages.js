// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const ERROR_MESSAGE_HEADER = 'Error';
const SUCCESS_MESSAGE_HEADER = 'Success';
const ERROR_GETTING_DATASET_MESSAGE =
  'There was an error retrieving the dataset';
const ERROR_GETTING_DATASETS_MESSAGE =
  'There was an error retrieving the datasets';
const ERROR_GETTING_ALGORITHMS_MESSAGE =
  'There was an error retrieving the algorithms';
const ERROR_GETTING_ALGORITHM_MESSAGE =
  'There was an error retrieving the algorithm';
const ERROR_SETTING_SAMPLE_DATABASE_MESSAGE =
  'There was an error setting the sample database';
const ERROR_SETTING_DATABASE_MESSAGE =
  'There was an error setting the database';
const ERROR_GETTING_DATABASE_MESSAGE =
  'There was an error retrieving the database';
const SUCCESS_LOADING_DATASET_MESSAGE = 'Dataset loaded successfully';
const ERROR_LOADING_DATASET_MESSAGE = 'There was an error loading the dataset';
const ERROR_MISSING_FILE_MESSAGE = 'The corresponding file was not found';
const buildPythonProcessErrorMessage = (code) =>
  `The python process exited with code ${code}`;
const ERROR_EXECUTING_PYTHON_ALGORITHM_MESSAGE =
  'There was an error executing the python algorithm';
const SUCCESS_EXECUTING_PYTHON_ALGORITHM_MESSAGE =
  'The python algorithm was executed successfully';
const ERROR_DELETING_DATASET_MESSAGE =
  'There was an error deleting the dataset';
const SUCCESS_DELETING_DATASET_MESSAGE = 'The dataset was deleted successfully';
const SUCCESS_DELETING_RESULT_MESSAGE =
  'The result dataset was deleted successfully';
const SUCCESS_DELETING_ALGORITHM_MESSAGE =
  'The algorithm was deleted successfully';
const ERROR_DELETING_RESULT_MESSAGE =
  'There was an error deleting the result dataset';
const ERROR_PYTHON_NOT_INSTALLED_MESSAGE =
  'Python was not found on your system. Please make sure you have Python 2.7.0 or better installed';
const buildPythonWrongVersionMessage = (version) =>
  `Your system is running Python version ${version}, which is not supported by this application. Please upgrade to Python 2.7.0 or better`;
const ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE =
  'There was an error verifying the installation of Python on your system. Try restarting the application. If the error persists, try reinstalling Python';
const ERROR_GETTING_LANGUAGE_MESSAGE =
  'There was an error retrieving the language';
const ERROR_SETTING_LANGUAGE_MESSAGE =
  'There was an error setting the language';
const ERROR_DELETING_ALGORITHM_MESSAGE =
  'There was an error deleting the algorithm';
const ERROR_EXECUTING_ALGORITHM_MESSAGE =
  'There was an error while executing the algorithm';
const UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE =
  'The programming language of the algorithm is not supported';
const ERROR_GETTING_RESULTS_MESSAGE =
  'There was an error retrieving the datasets';
const ERROR_GETTING_RESULT_MESSAGE =
  'There was an error retrieving the dataset';

module.exports = {
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_SETTING_SAMPLE_DATABASE_MESSAGE,
  ERROR_SETTING_DATABASE_MESSAGE,
  ERROR_GETTING_DATABASE_MESSAGE,
  SUCCESS_LOADING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
  ERROR_MISSING_FILE_MESSAGE,
  buildPythonProcessErrorMessage,
  ERROR_EXECUTING_PYTHON_ALGORITHM_MESSAGE,
  SUCCESS_EXECUTING_PYTHON_ALGORITHM_MESSAGE,
  ERROR_DELETING_DATASET_MESSAGE,
  SUCCESS_DELETING_DATASET_MESSAGE,
  SUCCESS_DELETING_RESULT_MESSAGE,
  ERROR_DELETING_RESULT_MESSAGE,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_GETTING_ALGORITHM_MESSAGE,
  SUCCESS_DELETING_ALGORITHM_MESSAGE,
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
  buildPythonWrongVersionMessage,
  ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE,
  ERROR_GETTING_LANGUAGE_MESSAGE,
  ERROR_SETTING_LANGUAGE_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE,
  ERROR_GETTING_RESULTS_MESSAGE,
  ERROR_GETTING_RESULT_MESSAGE,
};
