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
  CREATE_VALIDATION_SUCCESS,
  EXECUTE_ALGORITHM_UPDATE,
  STOP_EXECUTION_SUCCESS,
  EXECUTE_ALGORITHM_ERROR,
} from '../shared/types';
import { EXECUTION_STATUSES } from '../shared/constants';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map(),
  executions: List(),
});

const updateExecution = (execution) => (executions) => {
  const { id } = execution;
  const idx = executions.findIndex(({ id: executionId }) => executionId === id);
  if (idx < 0) {
    // eslint-disable-next-line no-console
    console.error('Execution not found, an error probably happened');
    return executions;
  }
  return executions.setIn([idx], execution);
};

const addExecutionToList = (execution) => (executions) => {
  return executions.push(execution);
};

const setExecutionStatus = ({ id }, status) => (executions) => {
  const idx = executions.findIndex(({ id: executionId }) => executionId === id);
  if (idx >= 0) {
    return executions.setIn([idx, 'status'], status);
  }
  return executions;
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_CREATING_EXECUTION:
    case FLAG_DELETING_EXECUTION:
    case FLAG_GETTING_EXECUTIONS:
    case FLAG_GETTING_EXECUTION:
    case FLAG_EXECUTING_ALGORITHM:
    case FLAG_CLEARING_EXECUTION:
      return state.update('activity', updateActivityList(payload));
    case GET_EXECUTIONS_SUCCESS:
      return state.set('executions', List(payload));
    case GET_EXECUTION_SUCCESS:
      return state.set('current', Map(payload));
    case CLEAR_EXECUTION_SUCCESS:
      return state.set('current', Map());
    case CREATE_EXECUTION_SUCCESS:
      return state.update('executions', addExecutionToList(payload));
    case EXECUTE_ALGORITHM_SUCCESS:
    case EXECUTE_ALGORITHM_ERROR:
    case EXECUTE_ALGORITHM_UPDATE: {
      let tmp = state;

      // if 'current' execution = modified execution => update it
      if (state.getIn(['current', 'id']) === payload.execution.id) {
        tmp = state.set('current', Map(payload.execution));
      }

      return tmp.update('executions', updateExecution(payload.execution));
    }
    case DELETE_EXECUTION_SUCCESS:
      return state.update('executions', (executions) =>
        executions.delete(
          executions.findIndex(({ id: exId }) => exId === payload),
        ),
      );
    case STOP_EXECUTION_SUCCESS:
      return state.update(
        'executions',
        setExecutionStatus(payload, EXECUTION_STATUSES.ERROR),
      );
    case CREATE_VALIDATION_SUCCESS:
      return state.update('executions', (executions) =>
        executions.concat(payload.executions),
      );

    default:
      return state;
  }
};
