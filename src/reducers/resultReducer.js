import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  FLAG_GETTING_RESULT,
  FLAG_GETTING_RESULTS,
  GET_RESULT_SUCCESS,
  GET_RESULTS_SUCCESS,
  FLAG_EXPORTING_RESULT,
  FLAG_DELETING_RESULT,
  CLEAR_RESULT_SUCCESS,
  FLAG_CLEARING_RESULT,
  EXECUTE_ALGORITHM_SUCCESS,
  DELETE_RESULT_SUCCESS,
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
    case FLAG_CLEARING_RESULT:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_RESULT_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_RESULTS_SUCCESS:
      return state.setIn(['results'], List(payload));
    case CLEAR_RESULT_SUCCESS:
      return state.setIn(['current', 'content'], Map());
    case EXECUTE_ALGORITHM_SUCCESS:
      // add result to list when execution is successful
      return state.updateIn(['results'], (results) =>
        results.push(payload.result),
      );
    case DELETE_RESULT_SUCCESS:
      return state.updateIn(['results'], (results) =>
        results.filter((result) => result.id !== payload),
      );
    default:
      return state;
  }
};
