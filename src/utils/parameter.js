import { PARAMETER_TYPES_PYTHON } from '../config/constants';
import { PARAMETER_TYPES } from '../shared/constants';

// verify if the parameter value satisfies the type
export const isParameterValid = ({ type, value }) => {
  return {
    [PARAMETER_TYPES.FIELD_SELECTOR]: () => true,
    [PARAMETER_TYPES.FLOAT_INPUT]: (v) => !Number.isNaN(Number(v)),
    [PARAMETER_TYPES.INTEGER_INPUT]: (v) => Number.isInteger(Number(v)),
    [PARAMETER_TYPES.STRING_INPUT]: () => true,
  }[type](value);
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

// set the parameters in the python code using regex
export const setParametersInCode = (code, parameters) => {
  const newArgs = parameters
    .map(
      ({ name, type }) =>
        `\n        {'name': '${name}', 'type': ${PARAMETER_TYPES_PYTHON[type]}}`,
    )
    .join(',');

  const newCode = code.replace(
    /(?<=(args = parse_arguments\()).*?(?=\))/ms,
    `[${newArgs}\n    ]`,
  );

  return newCode;
};

// check if object or if any of its descendants is 'selected'
export const anySelected = ({ selected, children }) => {
  return (
    selected ||
    (children && Object.values(children).some((child) => anySelected(child)))
  );
};
