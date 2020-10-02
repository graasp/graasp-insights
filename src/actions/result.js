import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_RESULT_CHANNEL,
  GET_RESULTS_CHANNEL,
  DELETE_RESULT_CHANNEL,
} from '../config/channels';
import {
  GET_RESULT_SUCCESS,
  FLAG_GETTING_RESULT,
  GET_RESULTS_SUCCESS,
  FLAG_GETTING_RESULTS,
  DELETE_RESULT_SUCCESS,
  FLAG_DELETING_RESULT,
} from '../types';
import {
  ERROR_GETTING_RESULT_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_RESULTS_MESSAGE,
  ERROR_DELETING_RESULT_MESSAGE,
} from '../config/messages';

export const getResults = () => (dispatch) => {
  const flagGettingResults = createFlag(FLAG_GETTING_RESULTS);
  try {
    dispatch(flagGettingResults(true));
    // tell electron to get results
    window.ipcRenderer.send(GET_RESULTS_CHANNEL);
    window.ipcRenderer.once(GET_RESULTS_CHANNEL, async (event, results) => {
      // if there is no result, show error
      if (!results) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_RESULTS_MESSAGE);
      } else {
        dispatch({
          type: GET_RESULTS_SUCCESS,
          payload: results,
        });
      }
      return dispatch(flagGettingResults(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_RESULTS_MESSAGE);
    dispatch(flagGettingResults(false));
  }
};

export const getResult = ({ id }) => (dispatch) => {
  const flagGettingResult = createFlag(FLAG_GETTING_RESULT);
  try {
    dispatch(flagGettingResult(true));

    // tell electron to get a result
    window.ipcRenderer.send(GET_RESULT_CHANNEL, { id });
    window.ipcRenderer.once(GET_RESULT_CHANNEL, async (event, result) => {
      // if there is no result, show error
      if (!result) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_RESULT_MESSAGE);
      } else {
        dispatch({
          type: GET_RESULT_SUCCESS,
          payload: result,
        });
      }
      return dispatch(flagGettingResult(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_RESULT_MESSAGE);
    dispatch(flagGettingResult(false));
  }
};

export const deleteResult = ({ id }) => (dispatch) => {
  const flagDeletingResult = createFlag(FLAG_DELETING_RESULT);
  try {
    dispatch(flagDeletingResult(true));

    window.ipcRenderer.send(DELETE_RESULT_CHANNEL, { id });
    window.ipcRenderer.once(DELETE_RESULT_CHANNEL, async () => {
      dispatch({
        type: DELETE_RESULT_SUCCESS,
      });
      dispatch(flagDeletingResult(false));
      return getResults()(dispatch);
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_RESULT_MESSAGE);
    dispatch(flagDeletingResult(false));
  }
};
