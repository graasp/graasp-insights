// this file needs to use module.s as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const FLAG_GETTING_DATASET = 'FLAG_GETTING_DATASET';
const GET_DATASET_SUCCESS = 'GET_DATASET_SUCCESS';
const GET_DATASETS_SUCCESS = 'GET_DATASETS_SUCCESS';
const FLAG_GETTING_DATASETS = 'FLAG_GETTING_DATASETS';
const LOAD_DATASET_SUCCESS = 'LOAD_DATASET_SUCCESS';
const LOAD_DATASET_ERROR = 'LOAD_DATASET_ERROR';
const FLAG_LOADING_DATASET = 'FLAG_LOADING_DATASET';
const FLAG_GETTING_DATABASE = 'FLAG_GETTING_DATABASE';
const GET_DATABASE_SUCCESS = 'GET_DATABASE_SUCCESS';
const GET_DATABASE_ERROR = 'GET_DATABASE_ERROR';
const FLAG_SETTING_SAMPLE_DATABASE = 'FLAG_SETTING_SAMPLE_DATABASE';
const FLAG_SETTING_GRAASP_DATABASE = 'FLAG_SETTING_GRAASP_DATABASE';
const SET_GRAASP_DATABASE_SUCCESS = 'SET_GRAASP_DATABASE_SUCCESS';
const SET_GRAASP_DATABASE_ERROR = 'SET_GRAASP_DATABASE_ERROR';
const FLAG_SETTING_DATABASE = 'FLAG_SETTING_DATABASE';
const GET_DATASET_ERROR = 'GET_DATASET_ERROR';
const GET_DATASETS_ERROR = 'GET_DATASETS_ERROR';
const SET_DATABASE_SUCCESS = 'SET_DATABASE_SUCCESS';
const SET_DATABASE_ERROR = 'SET_DATABASE_ERROR';
const EXECUTE_PYTHON_ALGORITHM_ERROR = 'EXECUTE_PYTHON_ALGORITHM_ERROR';
const EXECUTE_ALGORITHM_SUCCESS = 'EXECUTE_ALGORITHM_SUCCESS';
const FLAG_DELETING_DATASET = 'FLAG_DELETING_DATASET';
const DELETE_DATASET_SUCCESS = 'DELETE_DATASET_SUCCESS';
const DELETE_DATASET_ERROR = 'DELETE_DATASET_ERROR';
const DELETE_ALGORITHM_ERROR = 'DELETE_ALGORITHM_ERROR';
const GET_ALGORITHMS_SUCCESS = 'GET_ALGORITHMS_SUCCESS';
const FLAG_GETTING_ALGORITHMS = 'FLAG_GETTING_ALGORITHMS';
const DELETE_ALGORITHM_SUCCESS = 'DELETE_ALGORITHM_SUCCESS';
const FLAG_DELETING_ALGORITHM = 'FLAG_DELETING_ALGORITHM';
const FLAG_GETTING_RESULT = 'FLAG_GETTING_RESULT';
const GET_RESULT_SUCCESS = 'GET_RESULT_SUCCESS';
const GET_RESULT_ERROR = 'GET_RESULT_ERROR';
const GET_RESULTS_SUCCESS = 'GET_RESULTS_SUCCESS';
const FLAG_GETTING_RESULTS = 'FLAG_GETTING_RESULTS';
const FLAG_DELETING_RESULT = 'FLAG_DELETING_RESULT';
const DELETE_RESULT_SUCCESS = 'DELETE_RESULT_SUCCESS';
const DELETE_RESULT_ERROR = 'DELETE_RESULT_ERROR';
const FLAG_GETTING_LANGUAGE = 'FLAG_GETTING_LANGUAGE';
const FLAG_SETTING_LANGUAGE = 'FLAG_SETTING_LANGUAGE';
const GET_LANGUAGE_SUCCESS = 'GET_LANGUAGE_SUCCESS';
const SET_LANGUAGE_SUCCESS = 'SET_LANGUAGE_SUCCESS';
const GET_LANGUAGE_ERROR = 'GET_LANGUAGE_ERROR';
const GET_RESULTS_ERROR = 'GET_RESULTS_ERROR';
const FLAG_EXECUTING_ALGORITHM = 'FLAG_EXECUTING_ALGORITHM';
const CHECK_PYTHON_INSTALLATION_SUCCESS = 'CHECK_PYTHON_INSTALLATION_SUCCESS';
const CHECK_PYTHON_INSTALLATION_ERROR = 'CHECK_PYTHON_INSTALLATION_ERROR';
const FLAG_CHECKING_PYTHON_VERSION = 'FLAG_CHECKING_PYTHON_VERSION';
const GET_ALGORITHMS_ERROR = 'GET_ALGORITHMS_ERROR';
const GET_ALGORITHM_ERROR = 'GET_ALGORITHM_ERROR';
const FLAG_EXPORTING_DATASET = 'FLAG_EXPORTING_DATASET';
const EXPORT_DATASET_SUCCESS = 'EXPORT_DATASET_SUCCESS';
const EXPORT_DATASET_ERROR = 'EXPORT_DATASET_ERROR';
const FLAG_EXPORTING_RESULT = 'FLAG_EXPORTING_RESULT';
const EXPORT_RESULT_SUCCESS = 'EXPORT_RESULT_SUCCESS';
const EXPORT_RESULT_ERROR = 'EXPORT_RESULT_ERROR';
const SET_DATASET_FILE_SUCCESS = 'SET_DATASET_FILE_SUCCESS';
const SET_DATASET_FILE_ERROR = 'SET_DATASET_FILE_ERROR';
const FLAG_SETTING_DATASET_FILE = 'FLAG_SETTING_DATASET_FILE';
const GET_ALGORITHM_SUCCESS = 'GET_ALGORITHM_SUCCESS';
const FLAG_GETTING_ALGORITHM = 'FLAG_GETTING_ALGORITHM';
const FLAG_SAVING_ALGORITHM = 'FLAG_SAVING_ALGORITHM';
const SAVE_ALGORITHM_SUCCESS = 'SAVE_ALGORITHM_SUCCESS';
const SAVE_ALGORITHM_ERROR = 'SAVE_ALGORITHM_ERROR';
const FLAG_ADDING_ALGORITHM = 'FLAG_ADDING_ALGORITHM';
const ADD_ALGORITHM_SUCCESS = 'ADD_ALGORITHM_SUCCESS';
const ADD_ALGORITHM_ERROR = 'ADD_ALGORITHM_ERROR';
const FLAG_CLEARING_DATASET = 'FLAG_CLEARING_DATASET';
const CLEAR_DATASET_SUCCESS = 'CLEAR_DATASET_SUCCESS';
const FLAG_CLEARING_RESULT = 'FLAG_CLEARING_RESULT';
const CLEAR_RESULT_SUCCESS = 'CLEAR_RESULT_SUCCESS';
const CLEAR_ALGORITHM_SUCCESS = 'CLEAR_ALGORITHM_SUCCESS';
const FLAG_CLEARING_ALGORITHM = 'FLAG_CLEARING_ALGORITHM';
const FLAG_GETTING_UTILS = 'FLAG_GETTING_UTILS';
const GET_UTILS_SUCCESS = 'GET_UTILS_SUCCESS';
const GET_UTILS_ERROR = 'GET_UTILS_ERROR';
const FLAG_SAVING_UTILS = 'FLAG_SAVING_UTILS';
const SAVE_UTILS_SUCCESS = 'SAVE_UTILS_SUCCESS';
const SAVE_UTILS_ERROR = 'SAVE_UTILS_ERROR';
const GET_EXECUTIONS_SUCCESS = 'GET_EXECUTIONS_SUCCESS';
const GET_EXECUTIONS_ERROR = 'GET_EXECUTIONS_ERROR';
const EXECUTE_ALGORITHM_ERROR = 'EXECUTE_ALGORITHM_ERROR';
const FLAG_GETTING_EXECUTIONS = 'FLAG_GETTING_EXECUTIONS';
const FLAG_CREATING_EXECUTION = 'FLAG_CREATING_EXECUTION';
const CREATE_EXECUTION_SUCCESS = 'CREATE_EXECUTION_SUCCESS';
const FLAG_DELETING_EXECUTION = 'FLAG_DELETING_EXECUTION';
const DELETE_EXECUTION_SUCCESS = 'DELETE_EXECUTION_SUCCESS';
const DELETE_EXECUTION_ERROR = 'DELETE_EXECUTION_ERROR';
const CREATE_EXECUTION_ERROR = 'CREATE_EXECUTION_ERROR';
const FLAG_STOPPING_EXECUTION = 'FLAG_STOPPING_EXECUTION';
const STOP_EXECUTION_ERROR = 'STOP_EXECUTION_ERROR';
const STOP_EXECUTION_SUCCESS = 'STOP_EXECUTION_SUCCESS';
const EXECUTE_ALGORITHM_STOP = 'EXECUTE_ALGORITHM_STOP';
const SET_FILE_SIZE_LIMIT_SUCCESS = 'SET_FILE_SIZE_LIMIT_SUCCESS';
const SET_FILE_SIZE_LIMIT_ERROR = 'SET_FILE_SIZE_LIMIT_ERROR';
const FLAG_SETTING_FILE_SIZE_LIMIT = 'FLAG_SETTING_FILE_SIZE_LIMIT';
const GET_FILE_SIZE_LIMIT_SUCCESS = 'GET_FILE_SIZE_LIMIT_SUCCESS';
const GET_FILE_SIZE_LIMIT_ERROR = 'GET_FILE_SIZE_LIMIT_ERROR';
const FLAG_GETTING_FILE_SIZE_LIMIT = 'FLAG_GETTING_FILE_SIZE_LIMIT';
const GET_SETTINGS_ERROR = 'GET_SETTINGS_ERROR';
const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
const FLAG_GETTING_SETTINGS = 'FLAG_GETTING_SETTINGS';
const FLAG_GETTING_SCHEMAS = 'FLAG_GETTING_SCHEMAS';
const GET_SCHEMAS_SUCCESS = 'GET_SCHEMAS_SUCCESS';
const GET_SCHEMAS_ERROR = 'GET_SCHEMAS_ERROR';
const FLAG_SETTING_SCHEMA = 'FLAG_SETTING_SCHEMA';
const SET_SCHEMA_SUCCESS = 'SET_SCHEMA_SUCCESS';
const SET_SCHEMA_ERROR = 'SET_SCHEMA_ERROR';
const FLAG_DELETING_SCHEMA = 'FLAG_DELETING_SCHEMA';
const DELETE_SCHEMA_SUCCESS = 'DELETE_SCHEMA_SUCCESS';
const DELETE_SCHEMA_ERROR = 'DELETE_SCHEMA_ERROR';
const FLAG_DELETING_ALL = 'FLAG_DELETING_ALL';
const CLEAR_DATABASE_SUCCESS = 'CLEAR_DATABASE_SUCCESS';
const CLEAR_DATABASE_ERROR = 'CLEAR_DATABASE_ERROR';
const FLAG_GETTING_ALGORITHM_CODE = 'FLAG_GETTING_ALGORITHM_CODE';
const GET_ALGORITHM_CODE_SUCCESS = 'GET_ALGORITHM_CODE_SUCCESS';
const GET_ALGORITHM_CODE_ERROR = 'GET_ALGORITHM_CODE_ERROR';
const FLAG_GETTING_PIPELINES = 'FLAG_GETTING_PIPELINES';
const FLAG_GETTING_PIPELINE = 'FLAG_GETTING_PIPELINE';
const GET_PIPELINE_SUCCESS = 'GET_PIPELINE_SUCCESS';
const GET_PIPELINES_SUCCESS = 'GET_PIPELINES_SUCCESS';
const FLAG_CLEARING_PIPELINE = 'FLAG_CLEARING_PIPELINE';
const CLEAR_PIPELINE_SUCCESS = 'CLEAR_PIPELINE_SUCCESS';
const LOAD_PIPELINE_SUCCESS = 'LOAD_PIPELINE_SUCCESS';
const FLAG_SAVING_PIPELINE = 'FLAG_SAVING_PIPELINE';
const SAVE_PIPELINE_SUCCESS = 'SAVE_PIPELINE_SUCCESS';
const SAVE_PIPELINE_ERROR = 'SAVE_PIPELINE_ERROR';
const ADD_PIPELINE_SUCCESS = 'ADD_PIPELINE_SUCCESS';
const ADD_PIPELINE_ERROR = 'ADD_PIPELINE_ERROR';
const FLAG_ADDING_PIPELINE = 'FLAG_ADDING_PIPELINE';
const DELETE_PIPELINE_ERROR = 'DELETE_PIPELINE_ERROR';
const DELETE_PIPELINE_SUCCESS = 'DELETE_PIPELINE_SUCCESS';
const FLAG_DELETING_PIPELINE = 'FLAG_DELETING_PIPELINE';
const FLAG_GETTING_EXECUTION = 'FLAG_GETTING_EXECUTION';
const GET_EXECUTION_SUCCESS = 'GET_EXECUTION_SUCCESS';
const GET_EXECUTION_ERROR = 'GET_EXECUTION_ERROR';
const FLAG_CLEARING_EXECUTION = 'FLAG_CLEARING_EXECUTION';
const CLEAR_EXECUTION_SUCCESS = 'CLEAR_EXECUTION_SUCCESS';
const FLAG_CREATING_VALIDATION = 'FLAG_CREATING_VALIDATION';
const FLAG_GETTING_VALIDATIONS = 'FLAG_GETTING_VALIDATIONS';
const FLAG_DELETING_VALIDATION = 'FLAG_DELETING_VALIDATION';
const GET_VALIDATIONS_SUCCESS = 'GET_VALIDATIONS_SUCCESS';
const GET_VALIDATIONS_ERROR = 'GET_VALIDATIONS_ERROR';
const CREATE_VALIDATION_SUCCESS = 'CREATE_VALIDATION_SUCCESS';
const CREATE_VALIDATION_ERROR = 'CREATE_VALIDATION_ERROR';
const DELETE_VALIDATION_SUCCESS = 'DELETE_VALIDATION_SUCCESS';
const DELETE_VALIDATION_ERROR = 'DELETE_VALIDATION_ERROR';
const EXECUTE_ALGORITHM_UPDATE = 'EXECUTE_ALGORITHM_UPDATE';
const FLAG_EXECUTING_PIPELINE = 'FLAG_EXECUTING_PIPELINE';
const EXECUTE_PIPELINE_SUCCESS = 'EXECUTE_PIPELINE_SUCCESS';

module.exports = {
  FLAG_GETTING_DATABASE,
  GET_DATABASE_SUCCESS,
  GET_DATABASE_ERROR,
  FLAG_SETTING_SAMPLE_DATABASE,
  SET_GRAASP_DATABASE_SUCCESS,
  SET_GRAASP_DATABASE_ERROR,
  FLAG_SETTING_GRAASP_DATABASE,
  FLAG_SETTING_DATABASE,
  FLAG_GETTING_DATASET,
  GET_DATASET_SUCCESS,
  GET_DATASETS_SUCCESS,
  FLAG_GETTING_DATASETS,
  LOAD_DATASET_ERROR,
  LOAD_DATASET_SUCCESS,
  FLAG_LOADING_DATASET,
  GET_DATASET_ERROR,
  GET_DATASETS_ERROR,
  SET_DATABASE_SUCCESS,
  SET_DATABASE_ERROR,
  EXECUTE_PYTHON_ALGORITHM_ERROR,
  FLAG_DELETING_DATASET,
  DELETE_DATASET_SUCCESS,
  DELETE_DATASET_ERROR,
  DELETE_ALGORITHM_ERROR,
  GET_ALGORITHMS_SUCCESS,
  FLAG_GETTING_ALGORITHMS,
  DELETE_ALGORITHM_SUCCESS,
  FLAG_DELETING_ALGORITHM,
  FLAG_GETTING_RESULT,
  FLAG_GETTING_RESULTS,
  GET_RESULT_SUCCESS,
  GET_RESULTS_SUCCESS,
  FLAG_DELETING_RESULT,
  DELETE_RESULT_SUCCESS,
  DELETE_RESULT_ERROR,
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  GET_LANGUAGE_SUCCESS,
  GET_LANGUAGE_ERROR,
  SET_LANGUAGE_SUCCESS,
  GET_RESULT_ERROR,
  GET_RESULTS_ERROR,
  FLAG_EXECUTING_ALGORITHM,
  CHECK_PYTHON_INSTALLATION_SUCCESS,
  CHECK_PYTHON_INSTALLATION_ERROR,
  FLAG_CHECKING_PYTHON_VERSION,
  GET_ALGORITHMS_ERROR,
  GET_ALGORITHM_ERROR,
  FLAG_EXPORTING_DATASET,
  EXPORT_DATASET_SUCCESS,
  EXPORT_DATASET_ERROR,
  FLAG_EXPORTING_RESULT,
  EXPORT_RESULT_SUCCESS,
  EXPORT_RESULT_ERROR,
  SET_DATASET_FILE_SUCCESS,
  SET_DATASET_FILE_ERROR,
  FLAG_SETTING_DATASET_FILE,
  GET_ALGORITHM_SUCCESS,
  FLAG_GETTING_ALGORITHM,
  FLAG_SAVING_ALGORITHM,
  SAVE_ALGORITHM_SUCCESS,
  SAVE_ALGORITHM_ERROR,
  FLAG_ADDING_ALGORITHM,
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
  FLAG_CLEARING_DATASET,
  CLEAR_DATASET_SUCCESS,
  CLEAR_RESULT_SUCCESS,
  FLAG_CLEARING_RESULT,
  CLEAR_ALGORITHM_SUCCESS,
  FLAG_CLEARING_ALGORITHM,
  FLAG_GETTING_UTILS,
  GET_UTILS_SUCCESS,
  GET_UTILS_ERROR,
  FLAG_SAVING_UTILS,
  SAVE_UTILS_SUCCESS,
  SAVE_UTILS_ERROR,
  GET_EXECUTIONS_SUCCESS,
  GET_EXECUTIONS_ERROR,
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_ALGORITHM_SUCCESS,
  FLAG_GETTING_EXECUTIONS,
  CREATE_EXECUTION_SUCCESS,
  FLAG_CREATING_EXECUTION,
  DELETE_EXECUTION_SUCCESS,
  DELETE_EXECUTION_ERROR,
  FLAG_DELETING_EXECUTION,
  CREATE_EXECUTION_ERROR,
  STOP_EXECUTION_ERROR,
  FLAG_STOPPING_EXECUTION,
  STOP_EXECUTION_SUCCESS,
  EXECUTE_ALGORITHM_STOP,
  SET_FILE_SIZE_LIMIT_SUCCESS,
  SET_FILE_SIZE_LIMIT_ERROR,
  FLAG_SETTING_FILE_SIZE_LIMIT,
  GET_FILE_SIZE_LIMIT_SUCCESS,
  GET_FILE_SIZE_LIMIT_ERROR,
  FLAG_GETTING_FILE_SIZE_LIMIT,
  GET_SETTINGS_ERROR,
  GET_SETTINGS_SUCCESS,
  FLAG_GETTING_SETTINGS,
  FLAG_GETTING_SCHEMAS,
  GET_SCHEMAS_SUCCESS,
  GET_SCHEMAS_ERROR,
  FLAG_SETTING_SCHEMA,
  SET_SCHEMA_SUCCESS,
  SET_SCHEMA_ERROR,
  FLAG_DELETING_SCHEMA,
  DELETE_SCHEMA_SUCCESS,
  DELETE_SCHEMA_ERROR,
  FLAG_DELETING_ALL,
  CLEAR_DATABASE_SUCCESS,
  CLEAR_DATABASE_ERROR,
  FLAG_GETTING_ALGORITHM_CODE,
  GET_ALGORITHM_CODE_SUCCESS,
  GET_ALGORITHM_CODE_ERROR,
  FLAG_GETTING_PIPELINES,
  FLAG_GETTING_PIPELINE,
  GET_PIPELINE_SUCCESS,
  GET_PIPELINES_SUCCESS,
  FLAG_CLEARING_PIPELINE,
  LOAD_PIPELINE_SUCCESS,
  CLEAR_PIPELINE_SUCCESS,
  FLAG_SAVING_PIPELINE,
  SAVE_PIPELINE_SUCCESS,
  SAVE_PIPELINE_ERROR,
  ADD_PIPELINE_SUCCESS,
  ADD_PIPELINE_ERROR,
  FLAG_ADDING_PIPELINE,
  DELETE_PIPELINE_ERROR,
  DELETE_PIPELINE_SUCCESS,
  FLAG_DELETING_PIPELINE,
  FLAG_GETTING_EXECUTION,
  GET_EXECUTION_ERROR,
  GET_EXECUTION_SUCCESS,
  FLAG_CLEARING_EXECUTION,
  CLEAR_EXECUTION_SUCCESS,
  FLAG_CREATING_VALIDATION,
  FLAG_GETTING_VALIDATIONS,
  FLAG_DELETING_VALIDATION,
  GET_VALIDATIONS_SUCCESS,
  GET_VALIDATIONS_ERROR,
  CREATE_VALIDATION_SUCCESS,
  CREATE_VALIDATION_ERROR,
  DELETE_VALIDATION_SUCCESS,
  DELETE_VALIDATION_ERROR,
  EXECUTE_ALGORITHM_UPDATE,
  FLAG_EXECUTING_PIPELINE,
  EXECUTE_PIPELINE_SUCCESS,
};
