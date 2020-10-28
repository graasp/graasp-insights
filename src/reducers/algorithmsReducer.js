import { List, Map } from 'immutable';
import { updateActivityList } from './common';
import {
  GET_ALGORITHMS_SUCCESS,
  FLAG_GETTING_ALGORITHMS,
  DELETE_ALGORITHM_SUCCESS,
  FLAG_DELETING_ALGORITHM,
} from '../shared/types';

const INITIAL_STATE = Map({
  algorithms: List(),
  activity: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_ALGORITHMS:
    case FLAG_DELETING_ALGORITHM:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_ALGORITHMS_SUCCESS:
      return state.setIn(['algorithms'], List(payload));
    case DELETE_ALGORITHM_SUCCESS:
    default:
      return state;
  }
};
