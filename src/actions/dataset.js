import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_DATASET_CHANNEL,
  GET_DATASETS_CHANNEL,
  DELETE_DATASET_CHANNEL,
  LOAD_DATASET_CHANNEL,
  SET_DATASET_FILE_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_DATASET,
  FLAG_GETTING_DATASETS,
  FLAG_DELETING_DATASET,
  FLAG_LOADING_DATASET,
  FLAG_SETTING_DATASET_FILE,
  CLEAR_DATASET_SUCCESS,
  FLAG_CLEARING_DATASET,
} from '../shared/types';
import {
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_DELETING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
  ERROR_SETTING_DATASET_MESSAGE,
  ERROR_CLEARING_DATASET_MESSAGE,
} from '../shared/messages';

export const getDatasets = () => (dispatch) => {
  const flagGettingDatasets = createFlag(FLAG_GETTING_DATASETS);
  try {
    dispatch(flagGettingDatasets(true));
    // tell electron to get datasets
    window.ipcRenderer.send(GET_DATASETS_CHANNEL);
    window.ipcRenderer.once(GET_DATASETS_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingDatasets(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATASETS_MESSAGE);
    dispatch(flagGettingDatasets(false));
  }
};

export const loadDataset = ({
  fileCustomName,
  fileLocation,
  fileDescription,
}) => (dispatch) => {
  const flagLoadingDataset = createFlag(FLAG_LOADING_DATASET);
  try {
    dispatch(flagLoadingDataset(true));
    window.ipcRenderer.send(LOAD_DATASET_CHANNEL, {
      fileCustomName,
      fileLocation,
      fileDescription,
    });
    window.ipcRenderer.once(LOAD_DATASET_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagLoadingDataset(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOADING_DATASET_MESSAGE);
    dispatch(flagLoadingDataset(false));
  }
};

export const getDataset = ({ id }) => (dispatch) => {
  const flagGettingDataset = createFlag(FLAG_GETTING_DATASET);
  try {
    dispatch(flagGettingDataset(true));

    // tell electron to get a dataset
    window.ipcRenderer.send(GET_DATASET_CHANNEL, { id });
    window.ipcRenderer.once(GET_DATASET_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingDataset(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATASET_MESSAGE);
    dispatch(flagGettingDataset(false));
  }
};

export const deleteDataset = ({ id, name }) => (dispatch) => {
  const flagDeletingDataset = createFlag(FLAG_DELETING_DATASET);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      async (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingDataset(true));
          window.ipcRenderer.send(DELETE_DATASET_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_DATASET_CHANNEL,
            async (event, response) => {
              dispatch(response);
              getDatasets()(dispatch);
            },
          );
        }
        dispatch(flagDeletingDataset(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_DATASET_MESSAGE);
    dispatch(flagDeletingDataset(false));
  }
};

export const setDatasetFile = async (payload) => (dispatch) => {
  const flagSettingDatasetFile = createFlag(FLAG_SETTING_DATASET_FILE);
  try {
    dispatch(flagSettingDatasetFile(true));
    window.ipcRenderer.send(SET_DATASET_FILE_CHANNEL, payload);
    window.ipcRenderer.once(
      SET_DATASET_FILE_CHANNEL,
      async (event, response) => {
        dispatch(response);
        return dispatch(flagSettingDatasetFile(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_DATASET_MESSAGE);
    dispatch(flagSettingDatasetFile(false));
  }
};

export const clearDataset = () => (dispatch) => {
  const flagClearingDataset = createFlag(FLAG_CLEARING_DATASET);
  try {
    dispatch(flagClearingDataset(true));
    dispatch({ type: CLEAR_DATASET_SUCCESS });
    dispatch(flagClearingDataset(false));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(ERROR_CLEARING_DATASET_MESSAGE);
    dispatch(flagClearingDataset(false));
  }
};
