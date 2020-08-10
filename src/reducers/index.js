import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

export default combineReducers({
  // todo: keys should always be camelCase
  toastr,
});
