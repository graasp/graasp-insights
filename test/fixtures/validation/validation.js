import {
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
  GRAASP_SCHEMA_ID,
} from '../../../src/shared/constants';
import {
  PREEXISTING_VALIDATION_ALGORITHM,
  VALIDATION_ALGORITHM_FAILURE,
  VALIDATION_ALGORITHM_SUCCESS,
  VALIDATION_ALGORITHM_WARNING,
} from '../algorithms/algorithms';
import { SIMPLE_DATASET } from '../datasets/datasets';

const PREEXISTING_VALIDATION_EXECUTION = {
  id: 'preexesting-validation-execution',
  algorithmId: PREEXISTING_VALIDATION_ALGORITHM.id,
  algorithmName: PREEXISTING_VALIDATION_ALGORITHM.name,
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.SUCCESS,
    info: 'preexisting successful validation',
  },
};

const VALIDATION_EXECUTION_SUCCESS = {
  id: 'validation-execution-success',
  algorithmId: VALIDATION_ALGORITHM_SUCCESS.id,
  algorithmName: VALIDATION_ALGORITHM_SUCCESS.name,
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.SUCCESS,
    info: 'successful validation',
  },
};

const VALIDATION_EXECUTION_WARNING = {
  id: 'validation-execution-success',
  algorithmId: VALIDATION_ALGORITHM_WARNING.id,
  algorithmName: VALIDATION_ALGORITHM_WARNING.name,
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.WARNING,
    info: 'validation warning',
  },
};

const VALIDATION_EXECUTION_FAILURE = {
  id: 'validation-execution-success',
  algorithmId: VALIDATION_ALGORITHM_FAILURE.id,
  algorithmName: VALIDATION_ALGORITHM_FAILURE.name,
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.FAILURE,
    info: 'failing validation',
  },
};

export const PREEXISTING_VALIDATION = {
  id: 'preexisting-validation',
  executions: [PREEXISTING_VALIDATION_EXECUTION],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
  schemaId: GRAASP_SCHEMA_ID,
  datasetName: SIMPLE_DATASET.name,
};

export const VALIDATION_SUCCESS = {
  id: 'validation-success',
  executions: [VALIDATION_EXECUTION_SUCCESS],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
  schemaId: GRAASP_SCHEMA_ID,
  datasetName: SIMPLE_DATASET.name,
};

export const VALIDATION_WARNING = {
  id: 'validation-warning',
  executions: [VALIDATION_EXECUTION_WARNING],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
  schemaId: GRAASP_SCHEMA_ID,
  datasetName: SIMPLE_DATASET.name,
};

export const VALIDATION_FAILURE = {
  id: 'validation-failure',
  executions: [VALIDATION_EXECUTION_FAILURE],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
  schemaId: GRAASP_SCHEMA_ID,
  datasetName: SIMPLE_DATASET.name,
};

export const VALIDATION_MULTIPLE_ALGORITHMS = {
  id: 'validation-multiple',
  executions: [
    VALIDATION_EXECUTION_SUCCESS,
    VALIDATION_EXECUTION_WARNING,
    VALIDATION_EXECUTION_FAILURE,
  ],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
  schemaId: GRAASP_SCHEMA_ID,
  datasetName: SIMPLE_DATASET.name,
};
