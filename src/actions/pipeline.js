import { toastr } from 'react-redux-toastr';
import {
  GET_PIPELINES_CHANNEL,
  GET_PIPELINE_CHANNEL,
} from '../shared/channels';
import {
  FLAG_GETTING_PIPELINES,
  FLAG_GETTING_PIPELINE,
  FLAG_CLEARING_PIPELINE,
  CLEAR_PIPELINE_SUCCESS,
} from '../shared/types';
import { createFlag } from './common';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_PIPELINES_MESSAGE,
  ERROR_GETTING_PIPELINE_MESSAGE,
  ERROR_CLEARING_PIPELINE_MESSAGE,
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
