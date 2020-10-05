import { Map } from 'immutable';
import { GET_LANGUAGE_SUCCESS, SET_LANGUAGE_SUCCESS } from '../types';
import { DEFAULT_LANGUAGE } from '../config/constants';

const INITIAL_STATE = Map({
  lang: DEFAULT_LANGUAGE,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_LANGUAGE_SUCCESS:
    case SET_LANGUAGE_SUCCESS:
      return state.set('lang', payload);
    default:
      return state;
  }
};
