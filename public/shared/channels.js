// this file needs to use module.exports as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const EXECUTE_ALGORITHM_CHANNEL = 'execution:execute';
const buildExecuteAlgorithmChannel = (id) =>
  `${EXECUTE_ALGORITHM_CHANNEL}_${id}`;

module.exports = {
  LOAD_DATASET_CHANNEL: 'dataset:load',
  GET_DATASET_CHANNEL: 'dataset:get',
  GET_DATASETS_CHANNEL: 'datasets:get',
  SET_DATASET_FILE_CHANNEL: 'dataset:file:set',
  GET_DATABASE_CHANNEL: 'developer:database:get',
  SET_DATABASE_CHANNEL: 'developer:database:set',
  SET_SAMPLE_DATABASE_CHANNEL: 'developer:database:sample:set',
  DELETE_DATASET_CHANNEL: 'dataset:delete',
  GET_LANGUAGE_CHANNEL: 'settings:lang:get',
  SET_LANGUAGE_CHANNEL: 'settings:lang:set',
  DELETE_RESULT_CHANNEL: 'result:delete',
  GET_RESULT_CHANNEL: 'result:get',
  GET_RESULTS_CHANNEL: 'results:get',
  GET_ALGORITHMS_CHANNEL: 'algorithms:get',
  SHOW_SAVE_AS_PROMPT_CHANNEL: 'prompt:save-as:show',
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL: 'prompt:delete:confirm',
  DELETE_ALGORITHM_CHANNEL: 'algorithm:delete',
  CHECK_PYTHON_INSTALLATION_CHANNEL: 'settings:python:check',
  EXPORT_DATASET_CHANNEL: 'dataset:export',
  EXPORT_RESULT_CHANNEL: 'result:export',
  GET_ALGORITHM_CHANNEL: 'algorithm:get',
  SAVE_ALGORITHM_CHANNEL: 'algorithm:save',
  ADD_ALGORITHM_CHANNEL: 'algorithm:add',
  BROWSE_FILE_CHANNEL: 'file:browse',
  GET_UTILS_CHANNEL: 'utils:get',
  SAVE_UTILS_CHANNEL: 'utils:save',
  GET_EXECUTIONS_CHANNEL: 'executions:get',
  CREATE_EXECUTION_CHANNEL: 'execution:create',
  DELETE_EXECUTION_CHANNEL: 'execution:delete',
  STOP_EXECUTION_CHANNEL: 'execution:stop',
  EXECUTE_ALGORITHM_CHANNEL,
  buildExecuteAlgorithmChannel,
};
