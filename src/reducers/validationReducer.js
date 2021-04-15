import { Map, List } from 'immutable';
import {
  FLAG_GETTING_VALIDATIONS,
  FLAG_CREATING_VALIDATION,
  FLAG_DELETING_VALIDATION,
  FLAG_EXECUTING_VALIDATION,
  GET_VALIDATIONS_SUCCESS,
  CREATE_VALIDATION_SUCCESS,
  DELETE_VALIDATION_SUCCESS,
  EXECUTE_VALIDATION_ALGORITHM_SUCCESS,
  STOP_VALIDATION_EXECUTION_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  validations: List(),
  activity: {
    [FLAG_CREATING_VALIDATION]: List(),
    [FLAG_GETTING_VALIDATIONS]: List(),
    [FLAG_DELETING_VALIDATION]: List(),
    [FLAG_EXECUTING_VALIDATION]: List(),
  },
});

const addValidationToList = (validation) => (validations) => {
  return validations.push(validation);
};

const updateValidation = ({ validationId, executionId, execution }) => (
  validations,
) => {
  const vIdx = validations.findIndex(({ id }) => id === validationId);
  if (vIdx < 0) {
    // eslint-disable-next-line no-console
    console.error('Validation not found, an error probably happened');
    return validations;
  }
  const eIdx = validations
    .getIn([vIdx, 'executions'])
    .findIndex(({ id }) => id === executionId);
  if (eIdx < 0) {
    // eslint-disable-next-line no-console
    console.error('Validation execution not found, an error probably happened');
    return validations;
  }
  return validations.setIn([vIdx, 'executions', eIdx], execution);
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_VALIDATIONS_SUCCESS:
      return state.set('validations', List(payload));
    case CREATE_VALIDATION_SUCCESS:
      return state.update('validations', addValidationToList(payload));
    case EXECUTE_VALIDATION_ALGORITHM_SUCCESS:
    case STOP_VALIDATION_EXECUTION_SUCCESS:
      return state.update('validations', updateValidation(payload));
    case DELETE_VALIDATION_SUCCESS:
      return state.update('validations', (validations) =>
        validations.delete(
          validations.findIndex(({ id: exId }) => exId === payload),
        ),
      );
    default:
      return state;
  }
};
