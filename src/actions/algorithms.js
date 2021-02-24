import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_ALGORITHM_CHANNEL,
  GET_ALGORITHMS_CHANNEL,
  DELETE_ALGORITHM_CHANNEL,
  SAVE_ALGORITHM_CHANNEL,
  ADD_ALGORITHM_CHANNEL,
  ADD_BUILT_IN_ALGORITHM_CHANNEL,
  GET_UTILS_CHANNEL,
  SAVE_UTILS_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
  GET_ALGORITHM_CODE_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_ALGORITHMS,
  FLAG_DELETING_ALGORITHM,
  FLAG_GETTING_ALGORITHM,
  FLAG_SAVING_ALGORITHM,
  FLAG_ADDING_ALGORITHM,
  CLEAR_ALGORITHM_SUCCESS,
  FLAG_CLEARING_ALGORITHM,
  FLAG_GETTING_UTILS,
  FLAG_SAVING_UTILS,
  FLAG_GETTING_ALGORITHM_CODE,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_ALGORITHMS_MESSAGE,
  ERROR_DELETING_ALGORITHM_MESSAGE,
  ERROR_GETTING_ALGORITHM_MESSAGE,
  ERROR_SAVING_ALGORITHM_MESSAGE,
  ERROR_ADDING_ALGORITHM_MESSAGE,
  ERROR_CLEARING_ALGORITHM_MESSAGE,
  ERROR_GETTING_UTILS_MESSAGE,
  ERROR_SAVING_UTILS_MESSAGE,
  ERROR_GETTING_ALGORITHM_CODE_MESSAGE,
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

export const deleteAlgorithm = ({ id, name }) => (dispatch) => {
  const flagDeletingAlgorithm = createFlag(FLAG_DELETING_ALGORITHM);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingAlgorithm(true));
          window.ipcRenderer.send(DELETE_ALGORITHM_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_ALGORITHM_CHANNEL,
            async (event, response) => {
              dispatch(response);
              getAlgorithms()(dispatch);
            },
          );
        }
        dispatch(flagDeletingAlgorithm(false));
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

export const addAlgorithm = (payload, onSuccess) => (dispatch) => {
  const flagAddingAlgorithm = createFlag(FLAG_ADDING_ALGORITHM);
  try {
    dispatch(flagAddingAlgorithm(true));
    window.ipcRenderer.send(ADD_ALGORITHM_CHANNEL, payload);
    window.ipcRenderer.once(ADD_ALGORITHM_CHANNEL, async (event, response) => {
      dispatch(response);
      // eslint-disable-next-line no-unused-expressions
      onSuccess?.();
      return dispatch(flagAddingAlgorithm(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_ALGORITHM_MESSAGE);
    dispatch(flagAddingAlgorithm(false));
  }
};

export const addBuiltInAlgorithm = ({ id }, onSuccess) => (dispatch) => {
  const flagAddingAlgorithm = createFlag(FLAG_ADDING_ALGORITHM);
  try {
    dispatch(flagAddingAlgorithm(true));
    window.ipcRenderer.send(ADD_BUILT_IN_ALGORITHM_CHANNEL, { id });
    window.ipcRenderer.once(
      ADD_BUILT_IN_ALGORITHM_CHANNEL,
      async (event, response) => {
        dispatch(response);
        // eslint-disable-next-line no-unused-expressions
        onSuccess?.();
        return dispatch(flagAddingAlgorithm(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_ALGORITHM_MESSAGE);
    dispatch(flagAddingAlgorithm(false));
  }
};

export const clearAlgorithm = () => (dispatch) => {
  const flagClearingALGORITHM = createFlag(FLAG_CLEARING_ALGORITHM);
  try {
    dispatch(flagClearingALGORITHM(true));
    dispatch({ type: CLEAR_ALGORITHM_SUCCESS });
    dispatch(flagClearingALGORITHM(false));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(ERROR_CLEARING_ALGORITHM_MESSAGE);
    dispatch(flagClearingALGORITHM(false));
  }
};

export const getUtils = () => (dispatch) => {
  const flagGettingUtils = createFlag(FLAG_GETTING_UTILS);
  try {
    dispatch(flagGettingUtils(true));
    window.ipcRenderer.send(GET_UTILS_CHANNEL);
    window.ipcRenderer.once(GET_UTILS_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingUtils(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_UTILS_MESSAGE);
    dispatch(flagGettingUtils(false));
  }
};

export const saveUtils = (userUtils) => (dispatch) => {
  const flagSavingUtils = createFlag(FLAG_SAVING_UTILS);
  try {
    dispatch(flagSavingUtils(true));
    window.ipcRenderer.send(SAVE_UTILS_CHANNEL, userUtils);
    window.ipcRenderer.once(SAVE_UTILS_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagSavingUtils(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_UTILS_MESSAGE);
    dispatch(flagSavingUtils(false));
  }
};

export const getAlgorithmCode = (payload) => (dispatch) => {
  const flagGettingAlgorithmCode = createFlag(FLAG_GETTING_ALGORITHM_CODE);
  try {
    dispatch(flagGettingAlgorithmCode(true));
    window.ipcRenderer.send(GET_ALGORITHM_CODE_CHANNEL, payload);
    window.ipcRenderer.once(
      GET_ALGORITHM_CODE_CHANNEL,
      async (event, response) => {
        dispatch(response);
        return dispatch(flagGettingAlgorithmCode(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_ALGORITHM_CODE_MESSAGE);
    dispatch(flagGettingAlgorithmCode(false));
  }
};
