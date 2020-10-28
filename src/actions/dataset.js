import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_DATASET_CHANNEL,
  GET_DATASETS_CHANNEL,
  DELETE_DATASET_CHANNEL,
  SHOW_LOAD_DATASET_PROMPT_CHANNEL,
  RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
  LOAD_DATASET_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_DATASET,
  FLAG_GETTING_DATASETS,
  FLAG_DELETING_DATASET,
  FLAG_LOADING_DATASET,
} from '../shared/types';
import {
  ERROR_GETTING_DATASET_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_DATASETS_MESSAGE,
  ERROR_DELETING_DATASET_MESSAGE,
  ERROR_LOADING_DATASET_MESSAGE,
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

export const deleteDataset = ({ id }) => (dispatch) => {
  const flagDeletingDataset = createFlag(FLAG_DELETING_DATASET);
  try {
    dispatch(flagDeletingDataset(true));

    window.ipcRenderer.send(DELETE_DATASET_CHANNEL, { id });
    window.ipcRenderer.once(DELETE_DATASET_CHANNEL, async (event, response) => {
      dispatch(response);
      dispatch(flagDeletingDataset(false));
      return getDatasets()(dispatch);
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_DATASET_MESSAGE);
    dispatch(flagDeletingDataset(false));
  }
};

export const showPromptLoadDataset = (handleFileLocation) => () => {
  const options = {
    filters: [{ name: 'json', extensions: ['json'] }],
  };
  window.ipcRenderer.send(SHOW_LOAD_DATASET_PROMPT_CHANNEL, options);
  window.ipcRenderer.once(
    RESPOND_LOAD_DATASET_PROMPT_CHANNEL,
    (event, filePaths) => {
      if (filePaths && filePaths.length) {
        // currently we select only one file
        handleFileLocation(filePaths[0]);
      }
    },
  );
};
