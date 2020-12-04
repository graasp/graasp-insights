import path from 'path';
import { AUTHORS, PROGRAMMING_LANGUAGES } from '../../../src/shared/constants';

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
