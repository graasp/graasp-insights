import path from 'path';
import { DATASET_TYPES, SCHEMA_TYPES } from '../../../public/shared/constants';
import {
  AUTHORS,
  PROGRAMMING_LANGUAGES,
} from '../../../src/shared/constants';

export const EXECUTION_FAST = {
  dataset: {
    id: 'exec-fast-dataset',
    name: 'my dataset',
    filepath: path.join(__dirname, './executionFast_dataset.json'),
    size: 45,
    createdAt: Date.now(),
    lastModified: Date.now(),
    type: DATASET_TYPES.SOURCE,
    schema: SCHEMA_TYPES.GRAASP,
  },
  algorithm: {
    id: 'exec-fast-algo',
    name: 'algorithm',
    description: `description`,
    filepath: path.join(__dirname, './executionFast_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
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
    schema: SCHEMA_TYPES.GRAASP,
  },
  algorithm: {
    id: 'exec-slow-algo',
    name: 'slow algorithm',
    description: `description`,
    filepath: path.join(__dirname, './executionSlow_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
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
    schema: SCHEMA_TYPES.GRAASP,
  },
  algorithm: {
    id: 'exec-fast-algo-error',
    name: 'algorithm error',
    description: `description`,
    filepath: path.join(__dirname, './executionFastError_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
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
    schema: SCHEMA_TYPES.GRAASP,
  },
  algorithm: {
    id: 'exec-slow-algo-error',
    name: 'slow algorithm error',
    description: `description`,
    filepath: path.join(__dirname, './executionSlowError_algorithm.py'),
    author: AUTHORS.USER,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
};
