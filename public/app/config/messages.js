// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/messages.js
// and public/app/config/messages.js

const ERROR_MESSAGE_HEADER = 'Error';
const SUCCESS_MESSAGE_HEADER = 'Success';
const ERROR_GETTING_DATASET_MESSAGE =
  'There was an error retrieving the dataset';
const ERROR_GETTING_DATASETS_MESSAGE =
  'There was an error retrieving the datasets';
const ERROR_SETTING_SAMPLE_DATABASE_MESSAGE =
  'There was an error setting the sample database';
const ERROR_SETTING_DATABASE_MESSAGE =
  'There was an error setting the database';
const ERROR_GETTING_DATABASE_MESSAGE =
  'There was an error retrieving the database';
const ERROR_DELETING_DATASET_MESSAGE =
  'There was an error deleting the dataset';
const SUCCESS_LOADING_DATASET_MESSAGE = 'The dataset was loaded successfully';
const ERROR_LOADING_DATASET_MESSAGE = 'There was an error loading the dataset';
const ERROR_GETTING_LANGUAGE_MESSAGE =
  'There was an error retrieving the language';
const ERROR_SETTING_LANGUAGE_MESSAGE =
  'There was an error setting the language';
const ERROR_GETTING_ALGORITHMS_MESSAGE =
  'There was an error retrieving the algorithms';
const ERROR_DELETING_ALGORITHM_MESSAGE =
  'There was an error deleting the algorithm';

module.exports = {
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_SETTING_SAMPLE_DATABASE_MESSAGE,
  ERROR_SETTING_DATABASE_MESSAGE,
  ERROR_GETTING_DATABASE_MESSAGE,
  ERROR_DELETING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
  SUCCESS_LOADING_DATASET_MESSAGE,
  ERROR_GETTING_LANGUAGE_MESSAGE,
  ERROR_SETTING_LANGUAGE_MESSAGE,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
};
