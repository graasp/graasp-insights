import { List, Map } from 'immutable';
import { updateActivityList } from './common';
import {
  GET_ALGORITHMS_SUCCESS,
  FLAG_GETTING_ALGORITHMS,
  DELETE_ALGORITHM_SUCCESS,
  FLAG_DELETING_ALGORITHM,
  GET_ALGORITHM_SUCCESS,
  FLAG_GETTING_ALGORITHM,
  CLEAR_ALGORITHM_SUCCESS,
  FLAG_CLEARING_ALGORITHM,
  GET_UTILS_SUCCESS,
  FLAG_GETTING_UTILS,
  GET_ALGORITHM_CODE_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  algorithms: List(),
  activity: List(),
  current: Map({
    content: Map(),
    activity: List(),
  }),
  utils: Map({
    user: '',
    graasp: '',
    activity: List(),
  }),
  folder: null,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_ALGORITHMS:
    case FLAG_DELETING_ALGORITHM:
      return state.updateIn(['activity'], updateActivityList(payload));
    case FLAG_GETTING_ALGORITHM:
    case FLAG_CLEARING_ALGORITHM:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload),
      );
    case FLAG_GETTING_UTILS:
      return state.updateIn(['utils', 'activity'], updateActivityList(payload));
    case GET_ALGORITHMS_SUCCESS:
      return state
        .setIn(['algorithms'], List(payload.algorithms))
        .setIn(['folder'], payload.folder);
    case GET_ALGORITHM_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_ALGORITHM_CODE_SUCCESS:
      return state.setIn(['current', 'content', 'code'], payload);
    case CLEAR_ALGORITHM_SUCCESS:
      return state.setIn(['current', 'content'], Map());
    case GET_UTILS_SUCCESS: {
      const { user, graasp } = payload;
      return state
        .setIn(['utils', 'user'], user)
        .setIn(['utils', 'graasp'], graasp);
    }
    case DELETE_ALGORITHM_SUCCESS:
    default:
      return state;
  }
};
