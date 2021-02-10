import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  DELETE_SCHEMA_SUCCESS,
  FLAG_SETTING_SCHEMA,
  FLAG_GETTING_SCHEMAS,
  FLAG_DELETING_SCHEMA,
  GET_SCHEMAS_SUCCESS,
  SET_SCHEMA_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  schemas: Map(),
  activity: {
    [FLAG_GETTING_SCHEMAS]: List(),
    [FLAG_SETTING_SCHEMA]: List(),
    [FLAG_DELETING_SCHEMA]: List(),
  },
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_SCHEMAS:
    case FLAG_SETTING_SCHEMA:
    case FLAG_DELETING_SCHEMA:
      return state.updateIn(['activity', type], updateActivityList(payload));
    case GET_SCHEMAS_SUCCESS:
      return state.setIn(['schemas'], Map(payload));
    case SET_SCHEMA_SUCCESS:
      return state.setIn(['schemas', payload.id], payload);
    case DELETE_SCHEMA_SUCCESS: {
      return state.deleteIn(['schemas', payload.id]);
    }
    default:
      return state;
  }
};
