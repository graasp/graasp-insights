import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_ALGORITHMS_CHANNEL,
  DELETE_ALGORITHM_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_ALGORITHMS,
  FLAG_DELETING_ALGORITHM,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
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
