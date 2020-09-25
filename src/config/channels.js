// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/channels.js
// and public/app/config/channels.js

module.exports = {
  SHOW_LOAD_DATASET_PROMPT_CHANNEL: 'prompt:dataset:load:show',
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL: 'prompt:dataset:load:respond',
  LOAD_DATASET_CHANNEL: 'dataset:load',
  EXECUTE_PYTHON_ALGORITHM_CHANNEL: 'algorithm:python:execute',
  GET_DATASET_CHANNEL: 'dataset:get',
  GET_DATASETS_CHANNEL: 'datasets:get',
  GET_DATABASE_CHANNEL: 'developer:database:get',
  SET_DATABASE_CHANNEL: 'developer:database:set',
  SET_SAMPLE_DATABASE_CHANNEL: 'developer:database:sample:set',
};
