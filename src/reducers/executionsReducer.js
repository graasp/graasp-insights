import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import { FLAG_EXECUTING_ALGORITHM } from '../shared/types';

const INITIAL_STATE = Map({
  activity: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_EXECUTING_ALGORITHM:
      return state.update('activity', updateActivityList(payload));
    default:
      return state;
  }
};
