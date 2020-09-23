import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import { GET_DATASET_CHANNEL, GET_DATASETS_CHANNEL } from '../config/channels';
import {
  GET_DATASET_SUCCESS,
  FLAG_GETTING_DATASET,
  GET_DATASETS_SUCCESS,
  FLAG_GETTING_DATASETS,
} from '../types';
import {
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_DATASETS_MESSAGE,
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
