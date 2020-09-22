import { Map } from 'immutable';
import { GET_LANGUAGE_SUCCEEDED, SET_LANGUAGE_SUCCEEDED } from '../types';
import { DEFAULT_LANGUAGE } from '../config/constants';

const INITIAL_STATE = Map({
  lang: DEFAULT_LANGUAGE,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_LANGUAGE_SUCCEEDED:
    case SET_LANGUAGE_SUCCEEDED:
      return state.set('lang', payload);
    default:
      return state;
  }
};
