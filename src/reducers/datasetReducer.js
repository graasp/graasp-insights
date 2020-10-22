import { Map, List } from 'immutable';
import { updateActivityList, pushDatasetToList } from './common';
import {
  FLAG_GETTING_DATASET,
  FLAG_GETTING_DATASETS,
  GET_DATASET_SUCCESS,
  GET_DATASETS_SUCCESS,
  LOAD_DATASET_SUCCESS,
  DELETE_DATASET_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  current: Map({
    content: Map(),
    activity: List(),
  }),
  datasets: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_DATASET:
    case FLAG_GETTING_DATASETS:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload),
      );
    case GET_DATASET_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_DATASETS_SUCCESS:
      return state.setIn(['datasets'], List(payload));
    case LOAD_DATASET_SUCCESS:
      return state.updateIn(['datasets'], pushDatasetToList(payload));
    case DELETE_DATASET_SUCCESS:
    default:
      return state;
  }
};
