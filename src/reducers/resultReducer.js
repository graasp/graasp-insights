import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  FLAG_GETTING_RESULT,
  FLAG_GETTING_RESULTS,
  GET_RESULT_SUCCESS,
  GET_RESULTS_SUCCESS,
  FLAG_EXPORTING_RESULT,
  FLAG_DELETING_RESULT,
  EXECUTE_PYTHON_ALGORITHM_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map({
    content: Map(),
  }),
  results: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_RESULT:
    case FLAG_GETTING_RESULTS:
    case FLAG_EXPORTING_RESULT:
    case FLAG_DELETING_RESULT:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_RESULT_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_RESULTS_SUCCESS:
      return state.setIn(['results'], List(payload));
    case EXECUTE_PYTHON_ALGORITHM_SUCCESS:
      return state.update('results', (results) => results.push(payload));
    default:
      return state;
  }
};
