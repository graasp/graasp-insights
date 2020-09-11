// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/messages.js
// and public/app/config/messages.js

const ERROR_MESSAGE_HEADER = 'Error';
const SUCCESS_MESSAGE_HEADER = 'Success';
const ERROR_GETTING_DATASET_MESSAGE = 'There was an error getting the dataset';
const ERROR_GETTING_DATASETS_MESSAGE =
  'There was an error getting the datasets';

module.exports = {
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_GETTING_DATASETS_MESSAGE,
};
