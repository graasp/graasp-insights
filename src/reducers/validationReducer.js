import { Map, List } from 'immutable';
import {
  FLAG_GETTING_VALIDATIONS,
  FLAG_CREATING_VALIDATION,
  FLAG_DELETING_VALIDATION,
  GET_VALIDATIONS_SUCCESS,
  CREATE_VALIDATION_SUCCESS,
  DELETE_VALIDATION_SUCCESS,
} from '../shared/types';

const INITIAL_STATE = Map({
  validations: List(),
  activity: {
    [FLAG_CREATING_VALIDATION]: List(),
    [FLAG_GETTING_VALIDATIONS]: List(),
    [FLAG_DELETING_VALIDATION]: List(),
  },
});

const addValidationToList = (validation) => (validations) => {
  return validations.push(validation);
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_VALIDATIONS_SUCCESS:
      return state.set('validations', List(payload));
    case CREATE_VALIDATION_SUCCESS:
      return state.update(
        'validations',
        addValidationToList(payload.validation),
      );
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
