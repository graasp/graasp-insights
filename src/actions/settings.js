import { toastr } from 'react-redux-toastr';
import {
  GET_LANGUAGE_CHANNEL,
  SET_LANGUAGE_CHANNEL,
  CHECK_PYTHON_INSTALLATION_CHANNEL,
} from '../shared/channels';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_LANGUAGE_MESSAGE,
  ERROR_SETTING_LANGUAGE_MESSAGE,
  ERROR_PYTHON_NOT_INSTALLED_MESSAGE,
} from '../shared/messages';
import {
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  FLAG_CHECKING_PYTHON_VERSION,
} from '../shared/types';
import { createFlag } from './common';

const flagGettingLanguage = createFlag(FLAG_GETTING_LANGUAGE);
const flagSettingLanguage = createFlag(FLAG_SETTING_LANGUAGE);
const flagCheckingPythonVersion = createFlag(FLAG_CHECKING_PYTHON_VERSION);

const getLanguage = async () => (dispatch) => {
  try {
    dispatch(flagGettingLanguage(true));
    window.ipcRenderer.send(GET_LANGUAGE_CHANNEL);
    window.ipcRenderer.once(GET_LANGUAGE_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagGettingLanguage(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_LANGUAGE_MESSAGE);
    dispatch(flagGettingLanguage(false));
  }
};

const setLanguage = async ({ lang }) => (dispatch) => {
  try {
    dispatch(flagSettingLanguage(true));
    window.ipcRenderer.send(SET_LANGUAGE_CHANNEL, lang);
    window.ipcRenderer.once(SET_LANGUAGE_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagSettingLanguage(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_LANGUAGE_MESSAGE);
    dispatch(flagSettingLanguage(false));
  }
};

const checkPythonInstallation = () => (dispatch) => {
  try {
    dispatch(flagCheckingPythonVersion(true));
    window.ipcRenderer.send(CHECK_PYTHON_INSTALLATION_CHANNEL);
    window.ipcRenderer.once(
      CHECK_PYTHON_INSTALLATION_CHANNEL,
      async (event, response) => {
        dispatch(response);
        dispatch(flagCheckingPythonVersion(false));
      },
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_PYTHON_NOT_INSTALLED_MESSAGE);
    dispatch(flagCheckingPythonVersion(false));
  }
};

export { getLanguage, setLanguage, checkPythonInstallation };
