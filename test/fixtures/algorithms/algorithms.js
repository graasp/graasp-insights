import path from 'path';
import GRAASP_SCHEMA from '../../../public/app/schema/graasp.json';
import {
  AUTHORS,
  PARAMETER_TYPES,
  PROGRAMMING_LANGUAGES,
  GRAASP_SCHEMA_ID,
} from '../../../src/shared/constants';
import { generateFieldSelector } from '../../../src/shared/utils';

export const MISSING_FILE_ALGORITHM = {
  name: 'Algorithm name',
  description: 'Algorithm description',
  fileLocation: path.resolve(__dirname, './missingfile.py'),
};

export const SIMPLE_ALGORITHM = {
  name: 'Algorithm name',
  description: 'Algorithm description',
  fileLocation: path.resolve(__dirname, './sample_algorithm.py'),
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
};

export const REPLACEMENT_ALGORITHM = {
  name: 'Replacing algorithm name',
  description: 'Replacing algorithm description',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
};

export const PREEXISTING_USER_ALGORITHM = {
  id: 'pre-existing-algorithm',
  name: 'Pre-existing user algorithm',
  description: 'some description',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
};

export const ALGORITHM_WITH_PARAMETERS = {
  id: 'algorithm-with-parameters',
  name: 'Algorithm with parameters',
  description: 'Description of algorithm with parameters',
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  filepath: path.join(__dirname, './sample_algorithm.py'),
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
      value: { [GRAASP_SCHEMA_ID]: generateFieldSelector(GRAASP_SCHEMA) },
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
  parameters: [
    {
      name: 'password',
      type: PARAMETER_TYPES.STRING_INPUT,
      description: 'enter the correct password (PASSWORD)',
      value: 'guess',
    },
  ],
};
