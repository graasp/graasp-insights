import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  FLAG_GETTING_DATABASE,
  FLAG_SETTING_SAMPLE_DATABASE,
  FLAG_SETTING_DATABASE,
} from '../shared/types';
import {
  GET_DATABASE_CHANNEL,
  SET_SAMPLE_DATABASE_CHANNEL,
  SET_DATABASE_CHANNEL,
} from '../shared/channels';
import {
  ERROR_GETTING_DATABASE_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_SETTING_SAMPLE_DATABASE_MESSAGE,
  ERROR_SETTING_DATABASE_MESSAGE,
} from '../shared/messages';

const flagGettingDatabase = createFlag(FLAG_GETTING_DATABASE);
const flagSettingSampleDatabase = createFlag(FLAG_SETTING_SAMPLE_DATABASE);
const flagSettingDatabase = createFlag(FLAG_SETTING_DATABASE);

const getDatabase = async () => (dispatch) => {
  try {
    dispatch(flagGettingDatabase(true));
    window.ipcRenderer.send(GET_DATABASE_CHANNEL);
    window.ipcRenderer.once(GET_DATABASE_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagGettingDatabase(false));
    });
  } catch (err) {
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATABASE_MESSAGE);
    dispatch(flagGettingDatabase(false));
  }
};

const setDatabase = async (database) => (dispatch) => {
  try {
    dispatch(flagSettingDatabase(true));
    window.ipcRenderer.send(SET_DATABASE_CHANNEL, database);
    window.ipcRenderer.once(SET_DATABASE_CHANNEL, (event, response) => {
      dispatch(response);

      dispatch(flagSettingDatabase(false));
    });
  } catch (err) {
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_DATABASE_MESSAGE);
    dispatch(flagSettingDatabase(false));
  }
};

const setSampleDatabase = async () => (dispatch) => {
  try {
    dispatch(flagSettingSampleDatabase(true));
    window.ipcRenderer.send(SET_SAMPLE_DATABASE_CHANNEL);
    window.ipcRenderer.once(SET_SAMPLE_DATABASE_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagSettingSampleDatabase(false));
    });
  } catch (err) {
    console.error(err);
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_SAMPLE_DATABASE_MESSAGE);
    dispatch(flagSettingSampleDatabase(false));
  }
};

export { getDatabase, setDatabase, setSampleDatabase };
