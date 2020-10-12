import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_DATASET_CHANNEL,
  GET_DATASETS_CHANNEL,
  DELETE_DATASET_CHANNEL,
  LOAD_DATASET_CHANNEL,
} from '../config/channels';
import {
  GET_DATASET_SUCCESS,
  FLAG_GETTING_DATASET,
  GET_DATASETS_SUCCESS,
  FLAG_GETTING_DATASETS,
  DELETE_DATASET_SUCCESS,
  FLAG_DELETING_DATASET,
  LOAD_DATASET_SUCCESS,
  FLAG_LOADING_DATASET,
} from '../types';
import {
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_DELETING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
  SUCCESS_LOADING_DATASET_MESSAGE,
} from '../config/messages';

export const getDatasets = () => (dispatch) => {
  const flagGettingDatasets = createFlag(FLAG_GETTING_DATASETS);
  try {
    dispatch(flagGettingDatasets(true));
    // tell electron to get datasets
    window.ipcRenderer.send(GET_DATASETS_CHANNEL);
    window.ipcRenderer.once(GET_DATASETS_CHANNEL, async (event, datasets) => {
      // if there is no dataset, show error
      if (!datasets) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATASETS_MESSAGE);
      } else {
        dispatch({
          type: GET_DATASETS_SUCCESS,
          payload: datasets,
        });
      }
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
    window.ipcRenderer.once(LOAD_DATASET_CHANNEL, async (event, dataset) => {
      if (!dataset) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_LOADING_DATASET_MESSAGE);
      } else {
        dispatch({
          type: LOAD_DATASET_SUCCESS,
          payload: dataset,
        });
        toastr.success(SUCCESS_MESSAGE_HEADER, SUCCESS_LOADING_DATASET_MESSAGE);
      }
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
    window.ipcRenderer.once(GET_DATASET_CHANNEL, async (event, dataset) => {
      // if there is no dataset, show error
      if (!dataset) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATASET_MESSAGE);
      } else {
        dispatch({
          type: GET_DATASET_SUCCESS,
          payload: dataset,
        });
      }
      return dispatch(flagGettingDataset(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_DATASET_MESSAGE);
    dispatch(flagGettingDataset(false));
  }
};

export const deleteDataset = ({ id }) => (dispatch) => {
  const flagDeletingDataset = createFlag(FLAG_DELETING_DATASET);
  try {
    dispatch(flagDeletingDataset(true));

    window.ipcRenderer.send(DELETE_DATASET_CHANNEL, { id });
    window.ipcRenderer.once(DELETE_DATASET_CHANNEL, async () => {
      dispatch({
        type: DELETE_DATASET_SUCCESS,
      });
      dispatch(flagDeletingDataset(false));
      return getDatasets()(dispatch);
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_DATASET_MESSAGE);
    dispatch(flagDeletingDataset(false));
  }
};
