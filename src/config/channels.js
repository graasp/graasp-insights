// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/channels.js
// and public/app/config/channels.js

module.exports = {
  SHOW_LOAD_DATASET_PROMPT_CHANNEL: 'prompt:dataset:load:show',
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL: 'prompt:dataset:load:respond',
  LOAD_DATASET: 'dataset:load',
  EXECUTE_PYTHON_ALGORITHM: 'algorithm:python:execute',
};
