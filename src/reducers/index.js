import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import dataset from './datasetReducer';
import developer from './developerReducer';

export default combineReducers({
  toastr,
  dataset,
  developer,
});
