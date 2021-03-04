import _ from 'lodash';
import { PARAMETER_TYPES } from '../shared/constants';

// verify if the parameter value satisfies the type
export const isParameterValid = ({ type, value }) => {
  switch (type) {
    case PARAMETER_TYPES.FIELD_SELECTOR:
      return !_.isEmpty(value);
    case PARAMETER_TYPES.STRING_INPUT:
      return true;
    case PARAMETER_TYPES.FLOAT_INPUT:
      return !Number.isNaN(Number(value));
    case PARAMETER_TYPES.INTEGER_INPUT:
      return Number.isInteger(Number(value));
    default:
      return false;
  }
};

// name can only contain letters, digits and _ and can't start with a digit
export const isParameterNameValid = ({ name }) =>
  /^[a-zA-Z_][a-zA-Z\d_]*$/.test(name);

export const areParametersNamesUnique = (parameters) => {
  const names = parameters.map(({ name }) => name);
  return names.length === new Set(names).size;
};

// verify if all the parameters are valid and if every name is unique
export const areParametersValid = (parameters) =>
  areParametersNamesUnique(parameters) &&
  parameters.every(
    (param) => isParameterValid(param) && isParameterNameValid(param),
  );

// check if object or if any of its descendants is 'selected'
export const anySelected = (field) => {
  const properties = field.type?.includes('object')
    ? field.properties
    : field?.items?.properties;
  return (
    field.selected ||
    (properties && Object.values(properties).some(anySelected))
  );
};
