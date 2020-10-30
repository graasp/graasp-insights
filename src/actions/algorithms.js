import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_ALGORITHM_CHANNEL,
  GET_ALGORITHMS_CHANNEL,
  DELETE_ALGORITHM_CHANNEL,
  SAVE_ALGORITHM_CHANNEL,
  ADD_ALGORITHM_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_ALGORITHMS,
  FLAG_DELETING_ALGORITHM,
  FLAG_GETTING_ALGORITHM,
  FLAG_SAVING_ALGORITHM,
  FLAG_ADDING_ALGORITHM,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
  ERROR_GETTING_ALGORITHM_MESSAGE,
  ERROR_SAVING_ALGORITHM_MESSAGE,
  ERROR_ADDING_ALGORITHM_MESSAGE,
} from '../shared/messages';

export const getAlgorithms = () => (dispatch) => {
  const flagGettingAlgorithms = createFlag(FLAG_GETTING_ALGORITHMS);
  try {
    dispatch(flagGettingAlgorithms(true));
    // tell electron to get algorithms
    window.ipcRenderer.send(GET_ALGORITHMS_CHANNEL);
    window.ipcRenderer.once(GET_ALGORITHMS_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingAlgorithms(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_ALGORITHMS_MESSAGE);
    dispatch(flagGettingAlgorithms(false));
  }
};

export const deleteAlgorithm = ({ id }) => (dispatch) => {
  const flagDeletingAlgorithm = createFlag(FLAG_DELETING_ALGORITHM);
  try {
    dispatch(flagDeletingAlgorithm(true));

    window.ipcRenderer.send(DELETE_ALGORITHM_CHANNEL, { id });
    window.ipcRenderer.once(
      DELETE_ALGORITHM_CHANNEL,
      async (event, response) => {
        dispatch(response);
        dispatch(flagDeletingAlgorithm(false));
        return getAlgorithms()(dispatch);
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_ALGORITHM_MESSAGE);
    dispatch(flagDeletingAlgorithm(false));
  }
};

export const getAlgorithm = ({ id }) => (dispatch) => {
  const flagGettingAlgorithm = createFlag(FLAG_GETTING_ALGORITHM);
  try {
    dispatch(flagGettingAlgorithm(true));
    window.ipcRenderer.send(GET_ALGORITHM_CHANNEL, { id });
    window.ipcRenderer.once(GET_ALGORITHM_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingAlgorithm(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_ALGORITHM_MESSAGE);
    dispatch(flagGettingAlgorithm(false));
  }
};

export const saveAlgorithm = (algorithm) => (dispatch) => {
  const flagSavingAlgorithm = createFlag(FLAG_SAVING_ALGORITHM);
  try {
    dispatch(flagSavingAlgorithm(true));
    window.ipcRenderer.send(SAVE_ALGORITHM_CHANNEL, algorithm);
    window.ipcRenderer.once(SAVE_ALGORITHM_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagSavingAlgorithm(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_ALGORITHM_MESSAGE);
    dispatch(flagSavingAlgorithm(false));
  }
};

export const addAlgorithm = (algorithm) => (dispatch) => {
  const flagAddingAlgorithm = createFlag(FLAG_ADDING_ALGORITHM);
  try {
    dispatch(flagAddingAlgorithm(true));
    window.ipcRenderer.send(ADD_ALGORITHM_CHANNEL, algorithm);
    window.ipcRenderer.once(ADD_ALGORITHM_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagAddingAlgorithm(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_ALGORITHM_MESSAGE);
    dispatch(flagAddingAlgorithm(false));
  }
};
