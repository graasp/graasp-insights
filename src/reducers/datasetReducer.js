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
  SET_DATASET_FILE_SUCCESS,
  FLAG_CLEARING_DATASET,
  CLEAR_DATASET_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  activity: List(),
  current: Map({
    content: Map(),
  }),
  datasets: List(),
  folder: null,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_DATASET:
    case FLAG_GETTING_DATASETS:
    case FLAG_DELETING_DATASET:
    case FLAG_EXPORTING_DATASET:
    case FLAG_CLEARING_DATASET:
      return state.updateIn(['activity'], updateActivityList(payload));
    case GET_DATASET_SUCCESS:
      return state.setIn(['current', 'content'], Map(payload));
    case GET_DATASETS_SUCCESS:
      return state
        .setIn(['datasets'], List(payload.datasets))
        .setIn(['folder'], payload.folder);
    case LOAD_DATASET_SUCCESS:
      return state.updateIn(['datasets'], pushDatasetToList(payload));
    case SET_DATASET_FILE_SUCCESS: {
      const { content, schemaType } = payload;
      return state
        .setIn(['current', 'content', 'content'], content)
        .setIn(['current', 'content', 'schemaType'], schemaType);
    }
    case CLEAR_DATASET_SUCCESS:
      return state.setIn(['current', 'content'], Map());
    default:
      return state;
  }
};
