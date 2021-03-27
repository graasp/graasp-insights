import { toastr } from 'react-redux-toastr';
import {
  ADD_PIPELINE_CHANNEL,
  GET_PIPELINES_CHANNEL,
  GET_PIPELINE_CHANNEL,
  SAVE_PIPELINE_CHANNEL,
  DELETE_PIPELINE_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_PIPELINES,
  FLAG_GETTING_PIPELINE,
  FLAG_CLEARING_PIPELINE,
  CLEAR_PIPELINE_SUCCESS,
  FLAG_SAVING_PIPELINE,
  FLAG_ADDING_PIPELINE,
  FLAG_DELETING_PIPELINE,
} from '../shared/types';
import { createFlag } from './common';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_PIPELINES_MESSAGE,
  ERROR_GETTING_PIPELINE_MESSAGE,
  ERROR_CLEARING_PIPELINE_MESSAGE,
  ERROR_SAVING_PIPELINE_MESSAGE,
  ERROR_ADDING_PIPELINE_MESSAGE,
  ERROR_DELETING_PIPELINE_MESSAGE,
} from '../shared/messages';

export const getPipelines = () => (dispatch) => {
  const flagGettingPipelines = createFlag(FLAG_GETTING_PIPELINES);
  try {
    dispatch(flagGettingPipelines(true));
    window.ipcRenderer.send(GET_PIPELINES_CHANNEL);
    window.ipcRenderer.once(GET_PIPELINES_CHANNEL, async (event, payload) => {
      dispatch(payload);
      return dispatch(flagGettingPipelines(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_PIPELINES_MESSAGE);
    dispatch(flagGettingPipelines(false));
  }
};

export const getPipeline = ({ id }) => (dispatch) => {
  const flagGettingPipeline = createFlag(FLAG_GETTING_PIPELINE);
  try {
    dispatch(flagGettingPipeline(true));
    window.ipcRenderer.send(GET_PIPELINE_CHANNEL, { id });
    window.ipcRenderer.once(GET_PIPELINE_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagGettingPipeline(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_PIPELINE_MESSAGE);
    dispatch(flagGettingPipeline(false));
  }
};

export const clearPipeline = () => (dispatch) => {
  const flagClearingPipeline = createFlag(FLAG_CLEARING_PIPELINE);
  try {
    dispatch(flagClearingPipeline(true));
    dispatch({ type: CLEAR_PIPELINE_SUCCESS });
    dispatch(flagClearingPipeline(false));
  } catch (err) {
    toastr.error(ERROR_CLEARING_PIPELINE_MESSAGE);
    dispatch(flagClearingPipeline(false));
  }
};

export const savePipeline = (pipeline) => (dispatch) => {
  const flagSavingPipeline = createFlag(FLAG_SAVING_PIPELINE);
  try {
    dispatch(flagSavingPipeline(true));
    window.ipcRenderer.send(SAVE_PIPELINE_CHANNEL, pipeline);
    window.ipcRenderer.once(SAVE_PIPELINE_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagSavingPipeline(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SAVING_PIPELINE_MESSAGE);
    dispatch(flagSavingPipeline(false));
  }
};

export const addPipeline = (pipeline) => (dispatch) => {
  const flagAddingPipeline = createFlag(FLAG_ADDING_PIPELINE);
  try {
    dispatch(flagAddingPipeline(true));
    window.ipcRenderer.send(ADD_PIPELINE_CHANNEL, pipeline);
    window.ipcRenderer.once(ADD_PIPELINE_CHANNEL, async (event, response) => {
      dispatch(response);
      return dispatch(flagAddingPipeline(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_ADDING_PIPELINE_MESSAGE);
    dispatch(flagAddingPipeline(false));
  }
};

export const deletePipeline = ({ id, name }) => (dispatch) => {
  const flagDeletingPipeline = createFlag(FLAG_DELETING_PIPELINE);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingPipeline(true));
          window.ipcRenderer.send(DELETE_PIPELINE_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_PIPELINE_CHANNEL,
            async (event, response) => {
              dispatch(response);
              getPipelines()(dispatch);
            },
          );
        }
        dispatch(flagDeletingPipeline(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_PIPELINE_MESSAGE);
    dispatch(flagDeletingPipeline(false));
  }
};
