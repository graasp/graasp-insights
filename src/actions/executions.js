import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  EXECUTE_ALGORITHM_CHANNEL,
  GET_EXECUTIONS_CHANNEL,
  CREATE_EXECUTION_CHANNEL,
  DELETE_EXECUTION_CHANNEL,
} from '../shared/channels';
import {
  FLAG_EXECUTING_ALGORITHM,
  FLAG_CREATING_EXECUTION,
  FLAG_GETTING_EXECUTIONS,
  FLAG_DELETING_EXECUTION,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  ERROR_GETTING_EXECUTIONS_MESSAGE,
  ERROR_DELETING_EXECUTION_MESSAGE,
} from '../shared/messages';

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

export const executeAlgorithm = (execution) => (dispatch) => {
  const flagExecutingAlgorithm = createFlag(FLAG_EXECUTING_ALGORITHM);

  try {
    dispatch(flagExecutingAlgorithm(true));
    window.ipcRenderer.send(EXECUTE_ALGORITHM_CHANNEL, execution);
    window.ipcRenderer.once(
      `${EXECUTE_ALGORITHM_CHANNEL}_${execution.id}`,
      async (event, payload) => {
        dispatch(payload);
        dispatch(flagExecutingAlgorithm(false));
        return getExecutions()(dispatch);
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_EXECUTING_ALGORITHM_MESSAGE);
    dispatch(flagExecutingAlgorithm(false));
  }
};

export const createExecution = ({
  algorithmId,
  datasetId,
  autoStart = true,
}) => (dispatch) => {
  const flagCreatingExecution = createFlag(FLAG_CREATING_EXECUTION);
  try {
    dispatch(flagCreatingExecution(true));
    // tell electron to get executions
    window.ipcRenderer.send(CREATE_EXECUTION_CHANNEL, {
      algorithmId,
      datasetId,
    });
    window.ipcRenderer.once(
      CREATE_EXECUTION_CHANNEL,
      async (event, payload) => {
        dispatch(payload);
        dispatch(flagCreatingExecution(false));

        // automatically start the execution if no error
        const { payload: execution } = payload;
        if (!payload.error && execution && autoStart) {
          executeAlgorithm(execution)(dispatch);
        }
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_EXECUTIONS_MESSAGE);
    dispatch(flagCreatingExecution(false));
  }
};

export const deleteExecution = ({ id }) => (dispatch) => {
  const flagDeletingExecution = createFlag(FLAG_DELETING_EXECUTION);
  try {
    dispatch(flagDeletingExecution(true));

    window.ipcRenderer.send(DELETE_EXECUTION_CHANNEL, { id });
    window.ipcRenderer.once(DELETE_EXECUTION_CHANNEL, async (e, payload) => {
      dispatch(payload);
      return dispatch(flagDeletingExecution(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_EXECUTION_MESSAGE);
    dispatch(flagDeletingExecution(false));
  }
};
