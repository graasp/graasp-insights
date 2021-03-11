import path from 'path';
import {
  AUTHORS,
  PARAMETER_TYPES,
  PROGRAMMING_LANGUAGES,
  ALGORITHM_TYPES,
} from '../../../src/shared/constants';
import {
  INITIAL_UNDEFINED_SCHEMA,
  INITIAL_CORRUPTED_SCHEMA,
} from '../schema/schemas';

export const MISSING_FILE_ALGORITHM = {
  name: 'Algorithm name',
  description: 'Algorithm description',
  fileLocation: path.resolve(__dirname, './missingfile.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const SIMPLE_ALGORITHM = {
  name: 'Algorithm name',
  description: 'Algorithm description',
  fileLocation: path.resolve(__dirname, './sample_algorithm.py'),
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const REPLACEMENT_ALGORITHM = {
  name: 'Replacing algorithm name',
  description: 'Replacing algorithm description',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const PREEXISTING_USER_ALGORITHM = {
  id: 'pre-existing-algorithm',
  name: 'Pre-existing user algorithm',
  description: 'some description',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const PREEXISTING_GRAASP_ALGORITHM = {
  id: 'pre-existing-graasp-algorithm',
  name: 'Pre-existing graasp algorithm',
  description: 'some description for a graasp algorithm',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const ALGORITHM_WITH_PARAMETERS = {
  id: 'algorithm-with-parameters',
  name: 'Algorithm with parameters',
  description: 'Description of algorithm with parameters',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      name: 'param_integer',
      type: PARAMETER_TYPES.INTEGER_INPUT,
      description: 'integer parameter description',
      value: 42,
    },
    {
      name: 'param_float',
      type: PARAMETER_TYPES.FLOAT_INPUT,
      description: 'float parameter description',
      value: Math.PI,
    },
    {
      name: 'param_string',
      type: PARAMETER_TYPES.STRING_INPUT,
      description: 'string parameter description',
      value: 'foo',
    },
    {
      name: 'param_field_selector',
      type: PARAMETER_TYPES.FIELD_SELECTOR,
      description: 'field selector parameters description',
      value: ['data'],
    },
  ],
};

export const ALGORITHM_WITH_UNDEFINED_FIELD_SELECTORS = {
  id: 'algorithm-with-undefined-field-selectors',
  name: 'Algorithm with undefined field selectors',
  description: 'Description of algorithm with undefined field selectors',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      schema: INITIAL_UNDEFINED_SCHEMA.id,
      name: 'param_field_selector1',
      type: PARAMETER_TYPES.FIELD_SELECTOR,
      description: 'undefined field selector',
    },
  ],
};

export const ALGORITHM_WITH_CORRUPTED_FIELD_SELECTORS = {
  id: 'algorithm-with-corrupted-field-selectors',
  name: 'Algorithm with corrupted field selectors',
  description: 'Description of algorithm with corrupted field selectors',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      schema: INITIAL_CORRUPTED_SCHEMA.id,
      name: 'param_field_selector2',
      type: PARAMETER_TYPES.FIELD_SELECTOR,
      description: 'incorrect schema field selector',
    },
  ],
};

export const ALGORITHM_WITH_NO_SCHEMA_FIELD_SELECTORS = {
  id: 'algorithm-with-no-schema-field-selectors',
  name: 'Algorithm with no schema field selectors',
  description: 'Description of algorithm with no schema field selectors',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      name: 'param_field_selector',
      type: PARAMETER_TYPES.FIELD_SELECTOR,
      description: 'no schema field selector',
    },
  ],
};

export const ALGORITHM_WITH_INTEGER_PARAMETER = {
  id: 'algorithm-with-integer-parameter',
  name: 'Algorithm with integer parameter',
  description: 'Algorithm that expects a positive integer',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './algorithm_with_integer_parameter.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      name: 'positive_integer',
      type: PARAMETER_TYPES.INTEGER_INPUT,
      description: 'integer that should be positive',
      value: 1,
    },
  ],
};

export const ALGORITHM_WITH_FLOAT_PARAMETER = {
  id: 'algorithm-with-float-parameter',
  name: 'Algorithm with float parameter',
  description: 'Algorithm that expects a positive float',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './algorithm_with_float_parameter.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      name: 'positive_float',
      type: PARAMETER_TYPES.FLOAT_INPUT,
      description: 'float that should be positive',
      value: 1.0,
    },
  ],
};

export const ALGORITHM_WITH_STRING_PARAMETER = {
  id: 'algorithm-with-string-parameter',
  name: 'Algorithm with string parameter',
  description: 'Algorithm that expects the correct password (PASSWORD)',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './algorithm_with_string_parameter.py'),
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [
    {
      name: 'password',
      type: PARAMETER_TYPES.STRING_INPUT,
      description: 'enter the correct password (PASSWORD)',
      value: 'guess',
    },
  ],
};
