import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  EXECUTE_ALGORITHM_CHANNEL,
  GET_EXECUTIONS_CHANNEL,
  CREATE_EXECUTION_CHANNEL,
  DELETE_EXECUTION_CHANNEL,
  STOP_EXECUTION_CHANNEL,
  buildExecuteAlgorithmChannel,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
  GET_EXECUTION_CHANNEL,
} from '../shared/channels';
import {
  FLAG_EXECUTING_ALGORITHM,
  FLAG_CREATING_EXECUTION,
  FLAG_GETTING_EXECUTIONS,
  FLAG_DELETING_EXECUTION,
  FLAG_STOPPING_EXECUTION,
  FLAG_GETTING_EXECUTION,
  CLEAR_EXECUTION_SUCCESS,
  FLAG_CLEARING_EXECUTION,
  EXECUTE_ALGORITHM_SUCCESS,
  EXECUTE_ALGORITHM_ERROR,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  ERROR_GETTING_EXECUTIONS_MESSAGE,
  ERROR_DELETING_EXECUTION_MESSAGE,
  ERROR_CANCELING_EXECUTION_MESSAGE,
  ERROR_CREATING_EXECUTION_MESSAGE,
  ERROR_GETTING_EXECUTION_MESSAGE,
  ERROR_CLEARING_EXECUTION_MESSAGE,
} from '../shared/messages';
import { ALGORITHM_TYPES } from '../shared/constants';
import { executePipeline } from './pipeline';

export const getExecutions = () => (dispatch) => {
  const flagGettingExecutions = createFlag(FLAG_GETTING_EXECUTIONS);
  try {
    dispatch(flagGettingExecutions(true));
    // tell electron to get executions
    window.ipcRenderer.send(GET_EXECUTIONS_CHANNEL);
    window.ipcRenderer.once(GET_EXECUTIONS_CHANNEL, async (event, payload) => {
      dispatch(payload);
      return dispatch(flagGettingExecutions(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_EXECUTIONS_MESSAGE);
    dispatch(flagGettingExecutions(false));
  }
};

export const getExecution = (id) => (dispatch) => {
  const flagGettingExecution = createFlag(FLAG_GETTING_EXECUTION);
  try {
    dispatch(flagGettingExecution(true));
    window.ipcRenderer.send(GET_EXECUTION_CHANNEL, { id });
    window.ipcRenderer.once(GET_EXECUTION_CHANNEL, async (event, payload) => {
      dispatch(payload);
      return dispatch(flagGettingExecution(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_EXECUTION_MESSAGE);
    dispatch(flagGettingExecution(false));
  }
};

export const executeAlgorithm = (execution) => (dispatch) => {
  const flagExecutingAlgorithm = createFlag(FLAG_EXECUTING_ALGORITHM);

  try {
    dispatch(flagExecutingAlgorithm(true));

    const channel = buildExecuteAlgorithmChannel(execution.id);

    const listener = async (event, payload) => {
      dispatch(payload);
      switch (payload.type) {
        case EXECUTE_ALGORITHM_SUCCESS:
        case EXECUTE_ALGORITHM_ERROR:
          window.ipcRenderer.removeListener(channel, listener);
          dispatch(flagExecutingAlgorithm(false));
          break;
        default:
      }
    };
    window.ipcRenderer.send(EXECUTE_ALGORITHM_CHANNEL, execution);
    window.ipcRenderer.on(channel, listener);
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_EXECUTING_ALGORITHM_MESSAGE);
    dispatch(flagExecutingAlgorithm(false));
  }
};

export const createExecution = ({
  algorithmId,
  sourceId,
  autoStart = true,
  userProvidedFilename,
  parameters,
  schemaId,
}) => (dispatch) => {
  const flagCreatingExecution = createFlag(FLAG_CREATING_EXECUTION);
  try {
    dispatch(flagCreatingExecution(true));
    // tell electron to get executions
    window.ipcRenderer.send(CREATE_EXECUTION_CHANNEL, {
      algorithmId,
      sourceId,
      userProvidedFilename,
      parameters,
      schemaId,
    });
    window.ipcRenderer.once(
      CREATE_EXECUTION_CHANNEL,
      async (event, payload) => {
        dispatch(payload);
        dispatch(flagCreatingExecution(false));

        // automatically start the execution if no error
        const { payload: execution } = payload;
        if (!payload.error && execution && autoStart) {
          return execution?.algorithm?.type === ALGORITHM_TYPES.PIPELINE
            ? executePipeline(execution)(dispatch)
            : executeAlgorithm(execution)(dispatch);
        }

        return false;
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_CREATING_EXECUTION_MESSAGE);
    dispatch(flagCreatingExecution(false));
  }
};

export const deleteExecution = ({ id, name }) => (dispatch) => {
  const flagDeletingExecution = createFlag(FLAG_DELETING_EXECUTION);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingExecution(true));

          window.ipcRenderer.send(DELETE_EXECUTION_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_EXECUTION_CHANNEL,
            async (event, payload) => {
              dispatch(payload);
              dispatch(flagDeletingExecution(false));
            },
          );
        }
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_EXECUTION_MESSAGE);
    dispatch(flagDeletingExecution(false));
  }
};

export const cancelExecution = ({ id }) => (dispatch) => {
  const flagStoppingExecution = createFlag(FLAG_STOPPING_EXECUTION);
  try {
    dispatch(flagStoppingExecution(true));

    window.ipcRenderer.send(STOP_EXECUTION_CHANNEL, { id });
    window.ipcRenderer.once(STOP_EXECUTION_CHANNEL, async (e, payload) => {
      dispatch(payload);
      return dispatch(flagStoppingExecution(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_CANCELING_EXECUTION_MESSAGE);
    dispatch(flagStoppingExecution(false));
  }
};

export const clearExecution = () => (dispatch) => {
  const flagClearingExecution = createFlag(FLAG_CLEARING_EXECUTION);
  try {
    dispatch(flagClearingExecution(true));
    dispatch({ type: CLEAR_EXECUTION_SUCCESS });
    dispatch(flagClearingExecution(false));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(ERROR_CLEARING_EXECUTION_MESSAGE);
    dispatch(flagClearingExecution(false));
  }
};
