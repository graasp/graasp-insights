import path from 'path';
import {
  DATASET_TYPES,
  GRAASP_SCHEMA_ID,
  PARAMETER_TYPES,
} from '../../../public/shared/constants';
import {
  ALGORITHM_TYPES,
  AUTHORS,
  PROGRAMMING_LANGUAGES,
} from '../../../src/shared/constants';
import {
  ALGORITHM_WITH_INTEGER_PARAMETER,
  ALGORITHM_WITH_FLOAT_PARAMETER,
  ALGORITHM_WITH_STRING_PARAMETER,
} from '../algorithms/algorithms';

export const EXECUTION_FAST = {
  dataset: {
    id: 'exec-fast-dataset',
    name: 'my dataset',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: {
    id: 'exec-fast-algo',
    name: 'algorithm',
    description: `description`,
    filepath: path.join(__dirname, './executionFast_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
};

export const EXECUTION_SLOW = {
  dataset: {
    id: 'exec-slow-dataset',
    name: 'my slow dataset',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: {
    id: 'exec-slow-algo',
    name: 'slow algorithm',
    description: `description`,
    filepath: path.join(__dirname, './executionSlow_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
};

export const EXECUTION_FAST_ERROR = {
  dataset: {
    id: 'exec-fast-dataset-error',
    name: 'my dataset error',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: {
    id: 'exec-fast-algo-error',
    name: 'algorithm error',
    description: `description`,
    filepath: path.join(__dirname, './executionFastError_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
};

export const EXECUTION_SLOW_ERROR = {
  dataset: {
    id: 'exec-slow-dataset-error',
    name: 'my slow dataset error',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: {
    id: 'exec-slow-algo-error',
    name: 'slow algorithm error',
    description: `description`,
    filepath: path.join(__dirname, './executionSlowError_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
};

export const EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER = {
  dataset: {
    id: 'exec-with-successful-integer-parameter-dataset',
    name: 'my dataset for successful integer parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_INTEGER_PARAMETER,
  parameters: [
    {
      name: 'positive_integer',
      value: 42,
      type: PARAMETER_TYPES.INTEGER_INPUT,
    },
  ],
};

export const EXECUTION_WITH_FAILING_INTEGER_PARAMETER = {
  dataset: {
    id: 'exec-with-failing-integer-parameter-dataset',
    name: 'my dataset for failing integer parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_INTEGER_PARAMETER,
  parameters: [
    {
      name: 'positive_integer',
      value: -42,
      type: PARAMETER_TYPES.INTEGER_INPUT,
    },
  ],
};

export const EXECUTION_WITH_SUCCESSFUL_FLOAT_PARAMETER = {
  dataset: {
    id: 'exec-with-successful-float-parameter-dataset',
    name: 'my dataset for successful float parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_FLOAT_PARAMETER,
  parameters: [
    {
      name: 'positive_float',
      value: 42.0,
      type: PARAMETER_TYPES.FLOAT_INPUT,
    },
  ],
};

export const EXECUTION_WITH_FAILING_FLOAT_PARAMETER = {
  dataset: {
    id: 'exec-with-failing-float-parameter-dataset',
    name: 'my dataset for failing float parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_FLOAT_PARAMETER,
  parameters: [
    {
      name: 'positive_float',
      value: -33.0,
      type: PARAMETER_TYPES.FLOAT_INPUT,
    },
  ],
};

export const EXECUTION_WITH_SUCCESSFUL_STRING_PARAMETER = {
  dataset: {
    id: 'exec-with-successful-string-parameter-dataset',
    name: 'my dataset for successful string parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_STRING_PARAMETER,
  parameters: [
    {
      name: 'password',
      value: 'PASSWORD',
      type: PARAMETER_TYPES.STRING_INPUT,
    },
  ],
};

export const EXECUTION_WITH_FAILING_STRING_PARAMETER = {
  dataset: {
    id: 'exec-with-failing-string-parameter-dataset',
    name: 'my dataset for failing string parameter',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schemaIds: [GRAASP_SCHEMA_ID],
  },
  algorithm: ALGORITHM_WITH_STRING_PARAMETER,
  parameters: [
    {
      name: 'password',
      value: "i don't know",
      type: PARAMETER_TYPES.STRING_INPUT,
    },
  ],
};
