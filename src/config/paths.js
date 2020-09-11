export const HOME_PATH = '/';
export const LOAD_DATASET_PATH = '/load-dataset';
export const ALGORITHMS_PATH = '/algorithms';
export const DATASETS_PATH = '/datasets';
export const DATASET_PATH = '/dataset/:id';
export const DEVELOPER_PATH = '/developer';

export const buildDatasetPath = (id = ':id') => {
  return `/dataset/${id}`;
};
