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
  SUCCESS_DELETING_ALGORITHM_MESSAGE
};
