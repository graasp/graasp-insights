import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import { FLAG_GETTING_SCHEMAS, GET_SCHEMAS_SUCCESS } from '../shared/types';

const INITIAL_STATE = Map({
  schemas: Map(),
  activity: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_SCHEMAS:
      return state.update('activity', updateActivityList(payload));
    case GET_SCHEMAS_SUCCESS:
      return state.setIn(['schemas'], Map(payload));
    default:
      return state;
  }
};
