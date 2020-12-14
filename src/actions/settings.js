import { toastr } from 'react-redux-toastr';
import {
  GET_LANGUAGE_CHANNEL,
  SET_LANGUAGE_CHANNEL,
  CHECK_PYTHON_INSTALLATION_CHANNEL,
  GET_FILE_SIZE_LIMIT_CHANNEL,
  SET_FILE_SIZE_LIMIT_CHANNEL,
  GET_SETTINGS_CHANNEL,
} from '../shared/channels';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_LANGUAGE_MESSAGE,
  ERROR_SETTING_LANGUAGE_MESSAGE,
  ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE,
  ERROR_SETTING_FILE_SIZE_LIMIT_MESSAGE,
  ERROR_GETTING_FILE_SIZE_LIMIT_MESSAGE,
  ERROR_GETTING_SETTINGS_MESSAGE,
} from '../shared/messages';
import {
  FLAG_GETTING_LANGUAGE,
  FLAG_SETTING_LANGUAGE,
  FLAG_SETTING_FILE_SIZE_LIMIT,
  FLAG_GETTING_FILE_SIZE_LIMIT,
  FLAG_CHECKING_PYTHON_VERSION,
  FLAG_GETTING_SETTINGS,
} from '../shared/types';
import { createFlag } from './common';

const flagGettingSettings = createFlag(FLAG_GETTING_SETTINGS);
const flagGettingLanguage = createFlag(FLAG_GETTING_LANGUAGE);
const flagSettingLanguage = createFlag(FLAG_SETTING_LANGUAGE);
const flagGettingFileSizeLimit = createFlag(FLAG_GETTING_FILE_SIZE_LIMIT);
const flagSettingFileSizeLimit = createFlag(FLAG_SETTING_FILE_SIZE_LIMIT);
const flagCheckingPythonVersion = createFlag(FLAG_CHECKING_PYTHON_VERSION);

const getSettings = async () => (dispatch) => {
  try {
    dispatch(flagGettingSettings(true));
    window.ipcRenderer.send(GET_SETTINGS_CHANNEL);
    window.ipcRenderer.once(GET_SETTINGS_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagGettingSettings(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SETTINGS_MESSAGE);
    dispatch(flagGettingSettings(false));
  }
};

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

const getFileSizeLimit = async (fileSizeLimit) => (dispatch) => {
  try {
    dispatch(flagGettingFileSizeLimit(true));
    window.ipcRenderer.send(GET_FILE_SIZE_LIMIT_CHANNEL, fileSizeLimit);
    window.ipcRenderer.once(GET_FILE_SIZE_LIMIT_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagGettingFileSizeLimit(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_FILE_SIZE_LIMIT_MESSAGE);
    dispatch(flagGettingFileSizeLimit(false));
  }
};

const setFileSizeLimit = async (fileSizeLimit) => (dispatch) => {
  try {
    dispatch(flagSettingFileSizeLimit(true));
    window.ipcRenderer.send(SET_FILE_SIZE_LIMIT_CHANNEL, fileSizeLimit);
    window.ipcRenderer.once(SET_FILE_SIZE_LIMIT_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagSettingFileSizeLimit(false));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_FILE_SIZE_LIMIT_MESSAGE);
    dispatch(flagSettingFileSizeLimit(false));
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
    toastr.error(
      ERROR_MESSAGE_HEADER,
      ERROR_CHECKING_PYTHON_INSTALLATION_MESSAGE,
    );
    dispatch(flagCheckingPythonVersion(false));
  }
};

export {
  getSettings,
  getLanguage,
  setLanguage,
  checkPythonInstallation,
  getFileSizeLimit,
  setFileSizeLimit,
};
