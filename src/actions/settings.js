import { toastr } from 'react-redux-toastr';
import { GET_LANGUAGE_CHANNEL, SET_LANGUAGE_CHANNEL } from '../config/channels';
import { ERROR_GENERAL } from '../config/errors';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_LANGUAGE,
  ERROR_SETTING_LANGUAGE,
} from '../config/messages';
import {
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  GET_LANGUAGE_SUCCEEDED,
  SET_LANGUAGE_SUCCEEDED,
} from '../types';
import { createFlag } from './common';

const flagGettingLanguage = createFlag(FLAG_GETTING_LANGUAGE);
const flagSettingLanguage = createFlag(FLAG_SETTING_LANGUAGE);

const getLanguage = async () => (dispatch) => {
  try {
    dispatch(flagGettingLanguage(true));
    window.ipcRenderer.send(GET_LANGUAGE_CHANNEL);
    window.ipcRenderer.once(GET_LANGUAGE_CHANNEL, (event, lang) => {
      if (lang === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_LANGUAGE);
      } else {
        dispatch({
          type: GET_LANGUAGE_SUCCEEDED,
          payload: lang,
        });
      }
      dispatch(flagGettingLanguage(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_LANGUAGE);
  }
};

const setLanguage = async ({ lang }) => (dispatch) => {
  try {
    dispatch(flagSettingLanguage(true));
    window.ipcRenderer.send(SET_LANGUAGE_CHANNEL, lang);
    window.ipcRenderer.once(SET_LANGUAGE_CHANNEL, (event, payload) => {
      if (payload === ERROR_GENERAL) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_LANGUAGE);
      } else {
        dispatch({
          type: SET_LANGUAGE_SUCCEEDED,
          payload,
        });
      }
      dispatch(flagSettingLanguage(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_LANGUAGE);
  }
};

export { getLanguage, setLanguage };
