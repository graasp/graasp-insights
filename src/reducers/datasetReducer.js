import { Map, List } from 'immutable';
import { updateActivityList, pushDatasetToList } from './common';
import {
  FLAG_GETTING_DATASET,
  FLAG_GETTING_DATASETS,
  GET_DATASET_SUCCESS,
  GET_DATASETS_SUCCESS,
  LOAD_DATASET_SUCCESS,
  FLAG_DELETING_DATASET,
  FLAG_EXPORTING_DATASET,
} from '../shared/types';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map({
    content: Map(),
  }),
  datasets: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_DATASET:
    case FLAG_GETTING_DATASETS:
    case FLAG_DELETING_DATASET:
    case FLAG_EXPORTING_DATASET:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_DATASET_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_DATASETS_SUCCESS:
      return state.setIn(['datasets'], List(payload));
    case LOAD_DATASET_SUCCESS:
      return state.updateIn(['datasets'], pushDatasetToList(payload));
    default:
      return state;
  }
};
