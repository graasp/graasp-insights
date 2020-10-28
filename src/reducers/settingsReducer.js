import { Map, List } from 'immutable';
import { updateActivityList } from './common';
import {
  GET_LANGUAGE_SUCCESS,
  SET_LANGUAGE_SUCCESS,
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  CHECK_PYTHON_INSTALLATION_SUCCESS,
  CHECK_PYTHON_INSTALLATION_ERROR,
  FLAG_CHECKING_PYTHON_VERSION,
} from '../shared/types';
import { DEFAULT_LANGUAGE } from '../config/constants';

const INITIAL_STATE = Map({
  lang: DEFAULT_LANGUAGE,
  activity: List(),
  pythonVersion: null,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_LANGUAGE:
    case FLAG_SETTING_LANGUAGE:
    case FLAG_CHECKING_PYTHON_VERSION:
      return state.update('activity', updateActivityList(payload));
    case GET_LANGUAGE_SUCCESS:
    case SET_LANGUAGE_SUCCESS:
      return state.set('lang', payload);
    case CHECK_PYTHON_INSTALLATION_SUCCESS:
    case CHECK_PYTHON_INSTALLATION_ERROR:
      return state.setIn(['pythonVersion'], payload);
    default:
      return state;
  }
};
