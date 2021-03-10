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
  SET_FILE_SIZE_LIMIT_SUCCESS,
  FLAG_SETTING_FILE_SIZE_LIMIT,
  FLAG_GETTING_FILE_SIZE_LIMIT,
  GET_FILE_SIZE_LIMIT_SUCCESS,
  FLAG_GETTING_SETTINGS,
  GET_SETTINGS_SUCCESS,
} from '../shared/types';
import { DEFAULT_LANGUAGE } from '../config/constants';
import { DEFAULT_FILE_SIZE_LIMIT } from '../shared/constants';

const INITIAL_STATE = Map({
  lang: DEFAULT_LANGUAGE,
  activity: List(),
  pythonVersion: null,
  fileSizeLimit: DEFAULT_FILE_SIZE_LIMIT,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_LANGUAGE:
    case FLAG_SETTING_LANGUAGE:
    case FLAG_CHECKING_PYTHON_VERSION:
    case FLAG_SETTING_FILE_SIZE_LIMIT:
    case FLAG_GETTING_FILE_SIZE_LIMIT:
    case FLAG_GETTING_SETTINGS:
      return state.update('activity', updateActivityList(payload));
    case GET_SETTINGS_SUCCESS:
      return state.merge(Map(payload));
    case GET_LANGUAGE_SUCCESS:
    case SET_LANGUAGE_SUCCESS:
      return state.set('lang', payload);
    case CHECK_PYTHON_INSTALLATION_SUCCESS:
    case CHECK_PYTHON_INSTALLATION_ERROR:
      return state.setIn(['pythonVersion'], payload);
    case SET_FILE_SIZE_LIMIT_SUCCESS:
    case GET_FILE_SIZE_LIMIT_SUCCESS:
      return state.setIn(['fileSizeLimit'], payload);
    default:
      return state;
  }
};
