import { toastr } from 'react-redux-toastr';
import {
  ERROR_MISSING_FILE,
  ERROR_PYTHON_UNSUPPORTED_VERSION,
  ERROR_PYTHON_NOT_INSTALLED,
  ERROR_EXECUTION_PROCESS,
} from '../shared/errors';
import {
  LOAD_DATASET_SUCCESS,
  LOAD_DATASET_ERROR,
  GET_DATASETS_ERROR,
  GET_DATASET_ERROR,
  EXECUTE_ALGORITHM_ERROR,
  SET_DATABASE_ERROR,
  GET_DATABASE_ERROR,
  EXECUTE_ALGORITHM_SUCCESS,
  DELETE_DATASET_ERROR,
  DELETE_DATASET_SUCCESS,
  DELETE_RESULT_ERROR,
  DELETE_RESULT_SUCCESS,
  GET_ALGORITHMS_ERROR,
  GET_ALGORITHM_ERROR,
  DELETE_ALGORITHM_ERROR,
  DELETE_ALGORITHM_SUCCESS,
  CHECK_PYTHON_INSTALLATION_ERROR,
  GET_RESULT_ERROR,
  GET_RESULTS_ERROR,
  EXPORT_DATASET_ERROR,
  EXPORT_DATASET_SUCCESS,
  EXPORT_RESULT_ERROR,
  EXPORT_RESULT_SUCCESS,
  SET_DATASET_FILE_ERROR,
  SAVE_ALGORITHM_ERROR,
  SAVE_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_SUCCESS,
  ADD_ALGORITHM_ERROR,
  GET_UTILS_ERROR,
  SAVE_UTILS_ERROR,
  SAVE_UTILS_SUCCESS,
  GET_EXECUTIONS_ERROR,
  CREATE_EXECUTION_ERROR,
  DELETE_EXECUTION_ERROR,
  DELETE_EXECUTION_SUCCESS,
} from '../shared/types';
import {
  SUCCESS_LOADING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_MISSING_FILE_MESSAGE,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  ERROR_SETTING_DATABASE_MESSAGE,
  ERROR_GETTING_DATABASE_MESSAGE,
  buildProcessErrorMessage,
  ERROR_DELETING_DATASET_MESSAGE,
  SUCCESS_DELETING_DATASET_MESSAGE,
  SUCCESS_DELETING_RESULT_MESSAGE,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_GETTING_ALGORITHM_MESSAGE,
  ERROR_DELETING_RESULT_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
  ERROR_CREATING_EXECUTION_MESSAGE,
  SUCCESS_DELETING_ALGORITHM_MESSAGE,
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
  buildPythonWrongVersionMessage,
  ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE,
  ERROR_GETTING_RESULT_MESSAGE,
  ERROR_GETTING_RESULTS_MESSAGE,
  ERROR_EXPORTING_DATASET_MESSAGE,
  SUCCESS_EXPORTING_DATASET_MESSAGE,
  ERROR_EXPORTING_RESULT_MESSAGE,
  SUCCESS_EXPORTING_RESULT_MESSAGE,
  ERROR_SETTING_DATASET_FILE_MESSAGE,
  ERROR_SAVING_ALGORITHM_MESSAGE,
  SUCCESS_SAVING_ALGORITHM_MESSAGE,
  SUCCESS_ADDING_ALGORITHM_MESSAGE,
  ERROR_ADDING_ALGORITHM_MESSAGE,
  ERROR_GETTING_UTILS_MESSAGE,
  ERROR_SAVING_UTILS_MESSAGE,
  SUCCESS_SAVING_UTILS_MESSAGE,
  ERROR_GETTING_EXECUTIONS_MESSAGE,
  ERROR_DELETING_EXECUTION_MESSAGE,
  SUCCESS_DELETING_EXECUTION_MESSAGE,
  buildExecutingAlgorithmSuccessMessage,
} from '../shared/messages';
import i18n from '../config/i18n';

const middleware = () => (next) => (action) => {
  const { type, error, payload, log } = action;
  const options = {};

  // display error message notification
  let message = null;
  switch (type) {
    // error messages
    case LOAD_DATASET_ERROR:
      message = ERROR_LOADING_DATASET_MESSAGE;
      break;
    case GET_DATASETS_ERROR:
      message = ERROR_GETTING_DATASETS_MESSAGE;
      break;
    case GET_DATASET_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_GETTING_DATASET_MESSAGE;
      }
      break;
    case EXPORT_DATASET_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_EXPORTING_DATASET_MESSAGE;
      }
      break;
    case SET_DATASET_FILE_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_SETTING_DATASET_FILE_MESSAGE;
      }
      break;
    case GET_ALGORITHMS_ERROR:
      message = ERROR_GETTING_ALGORITHMS_MESSAGE;
      break;
    case GET_ALGORITHM_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_GETTING_ALGORITHM_MESSAGE;
      }
      break;
    case (type.match(new RegExp(`${EXECUTE_ALGORITHM_ERROR}`)) || {}).input:
      if (error === ERROR_EXECUTION_PROCESS && payload?.code) {
        message = buildProcessErrorMessage(payload.code);
      } else {
        message = ERROR_EXECUTING_ALGORITHM_MESSAGE;
      }
      // allow to display duplicate message for executions
      options.preventDuplicates = false;
      break;
    case CREATE_EXECUTION_ERROR:
      message = ERROR_CREATING_EXECUTION_MESSAGE;
      break;
    case DELETE_EXECUTION_ERROR:
      message = ERROR_DELETING_EXECUTION_MESSAGE;
      break;
    case GET_EXECUTIONS_ERROR:
      message = ERROR_GETTING_EXECUTIONS_MESSAGE;
      break;
    case SET_DATABASE_ERROR:
      message = ERROR_SETTING_DATABASE_MESSAGE;
      break;
    case GET_DATABASE_ERROR:
      message = ERROR_GETTING_DATABASE_MESSAGE;
      break;
    case DELETE_DATASET_ERROR:
      message = ERROR_DELETING_DATASET_MESSAGE;
      break;
    case DELETE_RESULT_ERROR:
      message = ERROR_DELETING_RESULT_MESSAGE;
      break;
    case DELETE_ALGORITHM_ERROR:
      message = ERROR_DELETING_ALGORITHM_MESSAGE;
      break;
    case CHECK_PYTHON_INSTALLATION_ERROR:
      if (error === ERROR_PYTHON_UNSUPPORTED_VERSION && payload?.version) {
        message = buildPythonWrongVersionMessage(payload.version);
      } else if (error === ERROR_PYTHON_NOT_INSTALLED) {
        message = ERROR_PYTHON_NOT_INSTALLED_MESSAGE;
      } else {
        message = ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE;
      }
      break;
    case GET_RESULT_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_GETTING_RESULT_MESSAGE;
      }
      break;
    case GET_RESULTS_ERROR:
      message = ERROR_GETTING_RESULTS_MESSAGE;
      break;
    case EXPORT_RESULT_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_EXPORTING_RESULT_MESSAGE;
      }
      break;
    case SAVE_ALGORITHM_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_SAVING_ALGORITHM_MESSAGE;
      }
      break;
    case ADD_ALGORITHM_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_ADDING_ALGORITHM_MESSAGE;
      }
      break;
    case GET_UTILS_ERROR:
      if (error === ERROR_MISSING_FILE) {
        message = ERROR_MISSING_FILE_MESSAGE;
      } else {
        message = ERROR_GETTING_UTILS_MESSAGE;
      }
      break;
    case SAVE_UTILS_ERROR:
      message = ERROR_SAVING_UTILS_MESSAGE;
      break;

    // success messages
    case LOAD_DATASET_SUCCESS:
      message = SUCCESS_LOADING_DATASET_MESSAGE;
      break;
    case (type.match(new RegExp(`${EXECUTE_ALGORITHM_SUCCESS}`)) || {}).input:
      message = buildExecutingAlgorithmSuccessMessage(payload.execution.name);

      // allow to display duplicate message for executions
      options.preventDuplicates = false;
      break;
    case DELETE_DATASET_SUCCESS:
      message = SUCCESS_DELETING_DATASET_MESSAGE;
      break;
    case DELETE_RESULT_SUCCESS:
      message = SUCCESS_DELETING_RESULT_MESSAGE;
      break;
    case DELETE_ALGORITHM_SUCCESS:
      message = SUCCESS_DELETING_ALGORITHM_MESSAGE;
      break;
    case EXPORT_DATASET_SUCCESS:
      message = SUCCESS_EXPORTING_DATASET_MESSAGE;
      break;
    case EXPORT_RESULT_SUCCESS:
      message = SUCCESS_EXPORTING_RESULT_MESSAGE;
      break;
    case SAVE_ALGORITHM_SUCCESS:
      message = SUCCESS_SAVING_ALGORITHM_MESSAGE;
      break;
    case ADD_ALGORITHM_SUCCESS:
      message = SUCCESS_ADDING_ALGORITHM_MESSAGE;
      break;
    case SAVE_UTILS_SUCCESS:
      message = SUCCESS_SAVING_UTILS_MESSAGE;
      break;
    case DELETE_EXECUTION_SUCCESS:
      message = SUCCESS_DELETING_EXECUTION_MESSAGE;
      break;
    default:
      break;
  }

  if (message && error) {
    toastr.error(i18n.t(ERROR_MESSAGE_HEADER), i18n.t(message), options);
    // todo: avoid dispatching if not necessary
    if (log) {
      // eslint-disable-next-line no-console
      console.error(log);
    }
  } else if (message) {
    toastr.success(i18n.t(SUCCESS_MESSAGE_HEADER), i18n.t(message), options);
    if (log) {
      // eslint-disable-next-line no-console
      console.log(log);
    }
  }

  if (!type) {
    // eslint-disable-next-line no-console
    console.error(
      `The following action is not defined correctly ${JSON.stringify(action)}`,
    );
  }

  // send to reduce
  const result = next(action);
  return result;
};

export default middleware;
