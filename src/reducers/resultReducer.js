import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  FLAG_GETTING_RESULT,
  FLAG_GETTING_RESULTS,
  GET_RESULT_SUCCESS,
  GET_RESULTS_SUCCESS,
  DELETE_RESULT_SUCCESS,
} from '../types';

const INITIAL_STATE = Map({
  current: Map({
    content: Map(),
    activity: List(),
  }),
  results: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_RESULT:
    case FLAG_GETTING_RESULTS:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload),
      );
    case GET_RESULT_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_RESULTS_SUCCESS:
      return state.setIn(['results'], List(payload));
    case DELETE_RESULT_SUCCESS:
    default:
      return state;
  }
};
