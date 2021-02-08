import { Map, List } from 'immutable';
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
  activity: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_SCHEMAS:
    case FLAG_SETTING_SCHEMA:
    case FLAG_DELETING_SCHEMA: {
      if (payload) {
        return state.update('activity', (list) => list.push(type));
      }

      const idx = state
        .get('activity')
        .findIndex((activityType) => activityType === type);
      if (idx !== -1) {
        return state.update('activity', (list) => list.delete(idx));
      }

      return state;
    }
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
