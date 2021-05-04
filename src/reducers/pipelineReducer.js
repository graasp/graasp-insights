import { Map, List } from 'immutable';
import { updateActivityList, updatePipelinesList } from './common';
import {
  FLAG_GETTING_PIPELINES,
  FLAG_GETTING_PIPELINE,
  GET_PIPELINE_SUCCESS,
  GET_PIPELINES_SUCCESS,
  FLAG_CLEARING_PIPELINE,
  CLEAR_PIPELINE_SUCCESS,
  FLAG_DELETING_PIPELINE,
  ADD_PIPELINE_SUCCESS,
  FLAG_EXECUTING_PIPELINE,
} from '../shared/types';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map(),
  pipelines: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_EXECUTING_PIPELINE:
    case FLAG_GETTING_PIPELINES:
    case FLAG_GETTING_PIPELINE:
    case FLAG_DELETING_PIPELINE:
    case FLAG_CLEARING_PIPELINE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_PIPELINE_SUCCESS:
      return state.setIn(['current'], Map(payload));
    case GET_PIPELINES_SUCCESS:
      return state.setIn(['pipelines'], List(payload));
    case CLEAR_PIPELINE_SUCCESS:
      return state.setIn(['current'], Map());
    case ADD_PIPELINE_SUCCESS:
      return state.updateIn(['pipelines'], updatePipelinesList(payload));
    default:
      return state;
  }
};
