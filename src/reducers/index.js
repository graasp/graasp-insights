import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import dataset from './datasetReducer';
import result from './resultReducer';
import developer from './developerReducer';
import settings from './settingsReducer';
import algorithms from './algorithmsReducer';
import executions from './executionsReducer';
import schema from './schemaReducer';
import pipeline from './pipelineReducer';
import validation from './validationReducer';

export default combineReducers({
  toastr,
  dataset,
  result,
  developer,
  settings,
  algorithms,
  executions,
  schema,
  pipeline,
  validation,
});
