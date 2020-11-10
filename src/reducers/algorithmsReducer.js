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
} from '../shared/types';
import { ALGORITHM_TYPES } from '../shared/constants';

const INITIAL_STATE = Map({
  algorithms: List(),
  activity: List(),
  current: Map({
    content: Map(),
    activity: List(),
  }),
  utils: List(),
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
    case GET_ALGORITHMS_SUCCESS:
      return state
        .setIn(
          ['algorithms'],
          List(
            payload.filter(
              ({ type: algoType }) => algoType !== ALGORITHM_TYPES.UTILS,
            ),
          ),
        )
        .setIn(
          ['utils'],
          List(
            payload.filter(
              ({ type: algoType }) => algoType === ALGORITHM_TYPES.UTILS,
            ),
          ),
        );
    case GET_ALGORITHM_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case CLEAR_ALGORITHM_SUCCESS:
      return state.setIn(['current', 'content'], Map());
    case DELETE_ALGORITHM_SUCCESS:
    default:
      return state;
  }
};
