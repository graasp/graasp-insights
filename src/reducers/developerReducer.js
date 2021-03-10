import { Map } from 'immutable';
import {
  GET_DATABASE_SUCCESS,
  SET_DATABASE_SUCCESS,
  SET_GRAASP_DATABASE_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  database: null,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_DATABASE_SUCCESS:
    case SET_DATABASE_SUCCESS:
    case SET_GRAASP_DATABASE_SUCCESS:
      return state.set('database', payload);
    default:
      return state;
  }
};
