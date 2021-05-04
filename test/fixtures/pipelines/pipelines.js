import path from 'path';
import {
  AUTHORS,
  PROGRAMMING_LANGUAGES,
  ALGORITHM_TYPES,
} from '../../../src/shared/constants';

export const PRIMARY_PIPELINE = {
  id: 'pipeline1',
  name: 'first pipeline',
  description: 'pipeline description 1',
  algorithms: [
    {
      id: 'exec-fast-algo',
      name: 'algorithm 1',
    },
    {
      id: 'exec-fast-algo-2',
      name: 'algorithm 2',
    },
  ],
};
export const SECONDARY_PIPELINE = {
  id: 'pipeline2',
  name: 'second pipeline',
  description: 'pipeline description 2',
  algorithms: [
    {
      id: 'exec-fast-algo',
      name: 'algorithm 1',
    },
    {
      id: 'exec-fast-algo-3',
      name: 'algorithm 3',
    },
    {
      id: 'exec-fast-algo-2',
      name: 'algorithm 2',
    },
  ],
};

export const AUXILIARY_PIPELINE = {
  name: 'auxiliary pipeline',
  description: 'pipeline auxiliary description ',
};

export const FIRST_ALGORITHM = {
  id: 'exec-fast-algo',
  name: 'algorithm 1',
  description: `description`,
  filepath: path.join(__dirname, '../executions/executionFast_algorithm.py'),
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const SECOND_ALGORITHM = {
  id: 'exec-fast-algo-2',
  name: 'algorithm 2',
  description: `description`,
  filepath: path.join(__dirname, '../executions/executionFast_algorithm.py'),
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const THIRD_ALGORITHM = {
  id: 'exec-fast-algo-3',
  name: 'algorithm 3',
  description: `description`,
  filepath: path.join(__dirname, '../executions/executionFast_algorithm.py'),
  author: AUTHORS.USER,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
};

export const ALGORITHMS_PIPELINES = [
  FIRST_ALGORITHM,
  SECOND_ALGORITHM,
  THIRD_ALGORITHM,
];
