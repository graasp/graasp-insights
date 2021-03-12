import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  FLAG_EXECUTING_ALGORITHM,
  EXECUTE_ALGORITHM_SUCCESS,
  GET_EXECUTIONS_SUCCESS,
  FLAG_GETTING_EXECUTIONS,
  CREATE_EXECUTION_SUCCESS,
  DELETE_EXECUTION_SUCCESS,
  FLAG_DELETING_EXECUTION,
  FLAG_GETTING_EXECUTION,
  FLAG_CREATING_EXECUTION,
  GET_EXECUTION_SUCCESS,
  CLEAR_EXECUTION_SUCCESS,
  FLAG_CLEARING_EXECUTION,
} from '../shared/types';
import { EXECUTION_STATUSES } from '../shared/constants';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map(),
  executions: List(),
});

const updateExecution = ({ id, resultId }) => (executions) => {
  const idx = executions.findIndex(({ id: executionId }) => executionId === id);
  if (idx > -1) {
    // eslint-disable-next-line no-console
    console.error('Execution not found, an error probably happened');
    return executions;
  }
  return executions.setIn([idx, 'resultId'], resultId);
};

const addExecutionToList = (execution) => (executions) => {
  return executions.push(execution);
};

const setExecutionStatus = ({ id }, status) => (executions) => {
  const idx = executions.findIndex(({ id: executionId }) => executionId === id);
  return executions.setIn([idx, 'status'], status);
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_CREATING_EXECUTION:
    case FLAG_DELETING_EXECUTION:
    case FLAG_GETTING_EXECUTIONS:
    case FLAG_GETTING_EXECUTION:
    case FLAG_CLEARING_EXECUTION:
      return state.update('activity', updateActivityList(payload));
    case FLAG_EXECUTING_ALGORITHM: {
      let tmp = state;
      if (payload) {
        // manually update the status of execution
        // this avoids a call to electron to fetch the running status
        tmp = state.update(
          'executions',
          setExecutionStatus(payload, EXECUTION_STATUSES.RUNNING),
        );
      }
      return tmp;
    }
    case GET_EXECUTIONS_SUCCESS:
      return state.set('executions', List(payload));
    case GET_EXECUTION_SUCCESS:
      return state.set('current', Map(payload));
    case CLEAR_EXECUTION_SUCCESS:
      return state.set('current', Map());
    case CREATE_EXECUTION_SUCCESS:
      return state.update('executions', addExecutionToList(payload));
    case EXECUTE_ALGORITHM_SUCCESS:
      return state.update('executions', updateExecution(payload.execution));
    case DELETE_EXECUTION_SUCCESS:
      return state.update('executions', (executions) =>
        executions.delete(
          executions.findIndex(({ id: exId }) => exId === payload),
        ),
      );

    default:
      return state;
  }
};
