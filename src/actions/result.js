import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  GET_RESULT_CHANNEL,
  GET_RESULTS_CHANNEL,
  DELETE_RESULT_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_RESULT,
  FLAG_GETTING_RESULTS,
  FLAG_DELETING_RESULT,
  FLAG_CLEARING_RESULT,
  CLEAR_RESULT_SUCCESS,
} from '../shared/types';
import {
  ERROR_GETTING_RESULT_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_RESULTS_MESSAGE,
  ERROR_DELETING_RESULT_MESSAGE,
  ERROR_CLEARING_RESULT_MESSAGE,
} from '../shared/messages';

export const getResults = () => (dispatch) => {
  const flagGettingResults = createFlag(FLAG_GETTING_RESULTS);
  try {
    dispatch(flagGettingResults(true));
    // tell electron to get results
    window.ipcRenderer.send(GET_RESULTS_CHANNEL);
    window.ipcRenderer.once(GET_RESULTS_CHANNEL, async (event, response) => {
      dispatch(response);
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
    window.ipcRenderer.once(GET_RESULT_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingResult(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_RESULT_MESSAGE);
    dispatch(flagGettingResult(false));
  }
};

export const deleteResult = ({ id, name }) => (dispatch) => {
  const flagDeletingResult = createFlag(FLAG_DELETING_RESULT);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingResult(true));
          window.ipcRenderer.send(DELETE_RESULT_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_RESULT_CHANNEL,
            async (event, response) => {
              dispatch(response);
              dispatch(flagDeletingResult(false));
            },
          );
        }
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_RESULT_MESSAGE);
    dispatch(flagDeletingResult(false));
  }
};

export const clearResult = () => (dispatch) => {
  const flagClearingResult = createFlag(FLAG_CLEARING_RESULT);
  try {
    dispatch(flagClearingResult(true));
    dispatch({ type: CLEAR_RESULT_SUCCESS });
    dispatch(flagClearingResult(false));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(ERROR_CLEARING_RESULT_MESSAGE);
    dispatch(flagClearingResult(false));
  }
};
