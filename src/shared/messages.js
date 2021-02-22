// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const { EXECUTION_NAME_MAX_LENGTH } = require('./constants');

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
const buildProcessErrorMessage = (code) =>
  `The process exited with code ${code}`;
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
const ERROR_EXECUTING_ALGORITHM_MESSAGE =
  'There was an error while executing the algorithm';
const ERROR_DELETING_ALGORITHM_MESSAGE =
  'There was an error deleting the algorithm';
const ERROR_UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE =
  'The programming language of the algorithm is not supported';
const ERROR_GETTING_RESULTS_MESSAGE =
  'There was an error retrieving the datasets';
const ERROR_GETTING_RESULT_MESSAGE =
  'There was an error retrieving the dataset';
const ERROR_EXPORTING_DATASET_MESSAGE =
  'There was an error exporting the dataset';
const SUCCESS_EXPORTING_DATASET_MESSAGE =
  'The dataset was exported successfully';
const ERROR_EXPORTING_RESULT_MESSAGE =
  'There was an error exporting the result';
const SUCCESS_EXPORTING_RESULT_MESSAGE = 'The result was exported successfully';
const ERROR_SETTING_DATASET_FILE_MESSAGE =
  'There was an error editing the dataset';
const ERROR_ADDING_ALGORITHM_MESSAGE =
  'There was an error adding the algorithm';
const SUCCESS_ADDING_ALGORITHM_MESSAGE = 'The algorithm was added successfully';
const ERROR_SAVING_ALGORITHM_MESSAGE =
  'There was an error saving the algorithm';
const SUCCESS_SAVING_ALGORITHM_MESSAGE = 'The algorithm was saved successfully';
const ERROR_CLEARING_DATASET_MESSAGE =
  'There was an error clearing the dataset';
const ERROR_CLEARING_RESULT_MESSAGE = 'There was an error clearing the result';
const ERROR_CLEARING_ALGORITHM_MESSAGE =
  'There was an error clearing the algorithm';
const ERROR_GETTING_UTILS_MESSAGE =
  'There was an error retrieving the utils file';
const ERROR_SAVING_UTILS_MESSAGE = 'There was an error saving the utils file';
const SUCCESS_SAVING_UTILS_MESSAGE = 'The utils file was saved successfully';
const ERROR_CREATING_EXECUTION_MESSAGE =
  'There was an error creating the execution';
const ERROR_GETTING_EXECUTIONS_MESSAGE =
  'There was an error retrieving the executions';
const ERROR_DELETING_EXECUTION_MESSAGE =
  'There was an error deleting the execution';
const SUCCESS_DELETING_EXECUTION_MESSAGE =
  'The execution was deleted successfully';
const buildExecutingAlgorithmSuccessMessage = (name) => {
  let splitName = name || '';
  if (splitName.length > EXECUTION_NAME_MAX_LENGTH) {
    splitName = `${splitName.slice(0, EXECUTION_NAME_MAX_LENGTH)}...`;
  }
  return `The execution ${splitName} was executed successfully`;
};
const ERROR_CANCELING_EXECUTION_MESSAGE =
  'There was an error canceling the execution';
const ERROR_SETTING_FILE_SIZE_LIMIT_MESSAGE =
  'There was an error setting the file size limit';
const ERROR_GETTING_FILE_SIZE_LIMIT_MESSAGE =
  'There was an error retrieving the file size limit';
const ERROR_OPENING_DATASET_MESSAGE = 'There was an error opening the dataset';
const ERROR_GETTING_SETTINGS_MESSAGE =
  'There was an error retrieving the settings';
const ERROR_OPENING_PATH_IN_EXPLORER_MESSAGE =
  'There was an error opening the path in the explorer';
const ERROR_GETTING_SCHEMAS_MESSAGE =
  'There was an error retrieving the schemas';
const SUCCESS_SETTING_SCHEMA_MESSAGE = 'The schema was saved successfully';
const ERROR_SETTING_SCHEMA_MESSAGE = 'There was an error saving the schema';
const SUCCESS_DELETING_SCHEMA_MESSAGE = 'The schema was deleted successfully';
const ERROR_DELETING_SCHEMA_MESSAGE = 'There was an error deleting the schema';
const ERROR_OPENING_URL_IN_BROWSER_MESSAGE =
  'There was an error opening the link in the browser';
const SUCCESS_DELETING_ALL_MESSAGE =
  'All application data was cleared successfully.';
const ERROR_DELETING_ALL_MESSAGE =
  'There was an error deleting some application data. Try clearing the remaining data manually.';

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
  buildProcessErrorMessage,
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
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  ERROR_UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE,
  ERROR_GETTING_RESULTS_MESSAGE,
  ERROR_GETTING_RESULT_MESSAGE,
  ERROR_EXPORTING_DATASET_MESSAGE,
  SUCCESS_EXPORTING_DATASET_MESSAGE,
  ERROR_EXPORTING_RESULT_MESSAGE,
  SUCCESS_EXPORTING_RESULT_MESSAGE,
  ERROR_SETTING_DATASET_FILE_MESSAGE,
  ERROR_ADDING_ALGORITHM_MESSAGE,
  SUCCESS_ADDING_ALGORITHM_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
  ERROR_SAVING_ALGORITHM_MESSAGE,
  SUCCESS_SAVING_ALGORITHM_MESSAGE,
  ERROR_CLEARING_DATASET_MESSAGE,
  ERROR_CLEARING_RESULT_MESSAGE,
  ERROR_CLEARING_ALGORITHM_MESSAGE,
  ERROR_GETTING_UTILS_MESSAGE,
  ERROR_SAVING_UTILS_MESSAGE,
  SUCCESS_SAVING_UTILS_MESSAGE,
  ERROR_CREATING_EXECUTION_MESSAGE,
  ERROR_GETTING_EXECUTIONS_MESSAGE,
  ERROR_DELETING_EXECUTION_MESSAGE,
  SUCCESS_DELETING_EXECUTION_MESSAGE,
  buildExecutingAlgorithmSuccessMessage,
  ERROR_CANCELING_EXECUTION_MESSAGE,
  ERROR_GETTING_FILE_SIZE_LIMIT_MESSAGE,
  ERROR_SETTING_FILE_SIZE_LIMIT_MESSAGE,
  ERROR_OPENING_DATASET_MESSAGE,
  ERROR_GETTING_SETTINGS_MESSAGE,
  ERROR_OPENING_PATH_IN_EXPLORER_MESSAGE,
  ERROR_GETTING_SCHEMAS_MESSAGE,
  SUCCESS_SETTING_SCHEMA_MESSAGE,
  ERROR_SETTING_SCHEMA_MESSAGE,
  SUCCESS_DELETING_SCHEMA_MESSAGE,
  ERROR_DELETING_SCHEMA_MESSAGE,
  ERROR_OPENING_URL_IN_BROWSER_MESSAGE,
  SUCCESS_DELETING_ALL_MESSAGE,
  ERROR_DELETING_ALL_MESSAGE,
};
