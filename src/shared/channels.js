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
  SET_GRAASP_DATABASE_CHANNEL: 'settings:database:graasp:set',
  DELETE_DATASET_CHANNEL: 'dataset:delete',
  GET_LANGUAGE_CHANNEL: 'settings:lang:get',
  SET_LANGUAGE_CHANNEL: 'settings:lang:set',
  DELETE_RESULT_CHANNEL: 'result:delete',
  GET_RESULT_CHANNEL: 'result:get',
  GET_RESULTS_CHANNEL: 'results:get',
  GET_ALGORITHMS_CHANNEL: 'algorithms:get',
  SHOW_SAVE_AS_PROMPT_CHANNEL: 'prompt:save-as:show',
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL: 'prompt:delete:confirm',
  SHOW_CONFIRM_CLEAR_DATABASE_PROMPT_CHANNEL: 'prompt:clearDatabase:confirm',
  CLEAR_DATABASE_CHANNEL: 'database:clear',
  DELETE_ALGORITHM_CHANNEL: 'algorithm:delete',
  CHECK_PYTHON_INSTALLATION_CHANNEL: 'settings:python:check',
  EXPORT_DATASET_CHANNEL: 'dataset:export',
  EXPORT_RESULT_CHANNEL: 'result:export',
  GET_ALGORITHM_CHANNEL: 'algorithm:get',
  SAVE_ALGORITHM_CHANNEL: 'algorithm:save',
  ADD_ALGORITHM_CHANNEL: 'algorithm:add',
  ADD_DEFAULT_ALGORITHM_CHANNEL: 'algorithm:add:default',
  GET_ALGORITHM_CODE_CHANNEL: 'algorithm:get:code',
  BROWSE_FILE_CHANNEL: 'file:browse',
  GET_UTILS_CHANNEL: 'utils:get',
  SAVE_UTILS_CHANNEL: 'utils:save',
  GET_EXECUTIONS_CHANNEL: 'executions:get',
  CREATE_EXECUTION_CHANNEL: 'execution:create',
  DELETE_EXECUTION_CHANNEL: 'execution:delete',
  STOP_EXECUTION_CHANNEL: 'execution:stop',
  OPEN_PATH_CHANNEL: 'open:path',
  EXECUTE_ALGORITHM_CHANNEL,
  buildExecuteAlgorithmChannel,
  SET_FILE_SIZE_LIMIT_CHANNEL: 'settings:file-size-limit:set',
  GET_FILE_SIZE_LIMIT_CHANNEL: 'settings:file-size-limit:get',
  SHOW_CONFIRM_OPEN_DATASET_CHANNEL: 'prompt:open:dataset:confirm',
  GET_SETTINGS_CHANNEL: 'settings:get',
  GET_SCHEMAS_CHANNEL: 'schemas:get',
  SET_SCHEMA_CHANNEL: 'schema:set',
  DELETE_SCHEMA_CHANNEL: 'schema:delete',
  OPEN_URL_IN_BROWSER_CHANNEL: 'open:browser',
  GET_PIPELINES_CHANNEL: 'pipelines:get',
  GET_PIPELINE_CHANNEL: 'pipeline:get',
  SAVE_PIPELINE_CHANNEL: 'pipeline:save',
  ADD_PIPELINE_CHANNEL: 'pipeline:add',
  DELETE_PIPELINE_CHANNEL: 'pipeline:delete',
  GET_EXECUTION_CHANNEL: 'execution:get',
  CREATE_VALIDATION_CHANNEL: 'validation:create',
  GET_VALIDATIONS_CHANNEL: 'validations:get',
  DELETE_VALIDATION_CHANNEL: 'validation:delete',
  SHOW_RESET_TEMPLATE_PROMPT_CHANNEL: 'prompt:reset-template:confirm',
};
