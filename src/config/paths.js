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
export const SCHEMAS_PATH = '/schemas';
export const SCHEMA_PATH = '/schema/:id';
export const PIPELINES_PATH = '/pipelines';
export const ADD_PIPELINE_PATH = '/add-pipeline';

export const buildDatasetPath = (id = ':id') => {
  return `/dataset/${id}`;
};

export const buildResultPath = (id = ':id') => {
  return `/result/${id}`;
};

export const buildEditAlgorithmPath = (id = ':id') => {
  return `/edit-algorithm/${id}`;
};

export const buildSchemaPath = (id = ':id') => `/schema/${id}`;

export const buildPipelinePath = (id = ':id') => {
  return `/pipeline/${id}`;
};

export const buildEditPipelinePath = (id = ':id') => {
  return `/edit-pipeline/${id}`;
};
export const buildExecutionPath = (id = ':id') => `/execution/${id}`;
