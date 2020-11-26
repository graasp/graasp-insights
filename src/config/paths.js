export const HOME_PATH = '/';
export const LOAD_DATASET_PATH = '/load-dataset';
export const ALGORITHMS_PATH = '/algorithms';
export const EDIT_ALGORITHM_PATH = '/edit-algorithm/:id';
export const EDIT_UTILS_PATH = '/edit-utils';
export const ADD_ALGORITHM_PATH = '/add-algorithm';
export const DATASETS_PATH = '/datasets';
export const DATASET_PATH = '/dataset/:id';
export const DEVELOPER_PATH = '/developer';
export const SETTINGS_PATH = '/settings';
export const RESULTS_PATH = '/results';
export const RESULT_PATH = '/result/:id';
export const EXECUTIONS_PATH = '/executions';
export const VISUALIZATIONS_PATH = '/visualizations';

export const buildDatasetPath = (id = ':id') => {
  return `/dataset/${id}`;
};

export const buildResultPath = (id = ':id') => {
  return `/result/${id}`;
};

export const buildEditAlgorithmPath = (id = ':id') => {
  return `/edit-algorithm/${id}`;
};
