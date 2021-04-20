import {
  EXECUTION_STATUSES,
  VALIDATION_STATUSES,
  GRAASP_SCHEMA_ID,
  ALGORITHM_TYPES,
} from '../../../src/shared/constants';
import {
  PREEXISTING_VALIDATION_ALGORITHM,
  VALIDATION_ALGORITHM_FAILURE,
  VALIDATION_ALGORITHM_SUCCESS,
  VALIDATION_ALGORITHM_WARNING,
} from '../algorithms/algorithms';
import { SIMPLE_DATASET } from '../datasets/datasets';

export const PREEXISTING_VALIDATION_EXECUTION = {
  id: 'preexesting-validation-execution',
  algorithm: PREEXISTING_VALIDATION_ALGORITHM,
  source: { id: SIMPLE_DATASET.id },
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.SUCCESS,
    info: 'preexisting successful validation',
  },
  schemaId: GRAASP_SCHEMA_ID,
  type: ALGORITHM_TYPES.VALIDATION,
  executedAt: Date.now(),
};

export const VALIDATION_EXECUTION_SUCCESS = {
  id: 'validation-execution-success',
  algorithm: VALIDATION_ALGORITHM_SUCCESS.id,
  source: { id: SIMPLE_DATASET.id },
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.SUCCESS,
    info: 'successful validation',
  },
  schemaId: GRAASP_SCHEMA_ID,
  type: ALGORITHM_TYPES.VALIDATION,
  executedAt: Date.now(),
};

export const VALIDATION_EXECUTION_WARNING = {
  id: 'validation-execution-success',
  algorithm: VALIDATION_ALGORITHM_WARNING.id,
  source: { id: SIMPLE_DATASET.id },
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.WARNING,
    info: 'validation warning',
  },
  schemaId: GRAASP_SCHEMA_ID,
  type: ALGORITHM_TYPES.VALIDATION,
  executedAt: Date.now(),
};

export const VALIDATION_EXECUTION_FAILURE = {
  id: 'validation-execution-success',
  algorithm: VALIDATION_ALGORITHM_FAILURE.id,
  source: { id: SIMPLE_DATASET.id },
  parameters: [],
  status: EXECUTION_STATUSES.SUCCESS,
  result: {
    outcome: VALIDATION_STATUSES.FAILURE,
    info: 'failing validation',
  },
  schemaId: GRAASP_SCHEMA_ID,
  type: ALGORITHM_TYPES.VALIDATION,
  executedAt: Date.now(),
};

export const PREEXISTING_VALIDATION = {
  id: 'preexisting-validation',
  executions: [PREEXISTING_VALIDATION_EXECUTION.id],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
};

export const VALIDATION_SUCCESS = {
  id: 'validation-success',
  executions: [VALIDATION_EXECUTION_SUCCESS.id],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
};

export const VALIDATION_WARNING = {
  id: 'validation-warning',
  executions: [VALIDATION_EXECUTION_WARNING.id],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
};

export const VALIDATION_FAILURE = {
  id: 'validation-failure',
  executions: [VALIDATION_EXECUTION_FAILURE.id],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
};

export const VALIDATION_MULTIPLE_ALGORITHMS = {
  id: 'validation-multiple',
  executions: [
    VALIDATION_EXECUTION_SUCCESS.id,
    VALIDATION_EXECUTION_WARNING.id,
    VALIDATION_EXECUTION_FAILURE.id,
  ],
  source: { id: SIMPLE_DATASET.id },
  verifiedAt: Date.now(),
};
