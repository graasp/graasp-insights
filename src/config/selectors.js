const parseName = (name) => name.split(' ').join('');

export const ALGORITHMS_MENU_ITEM_ID = 'algorithmsMenuItem';
export const DATASETS_MENU_ITEM_ID = 'datasetsMenuItem';
export const RESULTS_MENU_ITEM_ID = 'resultsMenuItem';
export const DRAWER_BUTTON_ID = 'drawerButton';
export const QUIT_MENU_ITEM_ID = 'quitMenuItem';
export const EXECUTIONS_MENU_ITEM_ID = 'executionsMenuItem';
export const DATASETS_EMPTY_ALERT_ID = 'datasetsEmptyAlert';
export const LOAD_DATASET_BUTTON_ID = 'loadDatasetButton';
export const LOAD_DATASET_NAME_ID = 'loadDatasetName';
export const LOAD_DATASET_DESCRIPTION_ID = 'loadDatasetDescription';
export const LOAD_DATASET_FILEPATH_ID = 'loadDatasetFilepath';
export const LOAD_DATASET_ACCEPT_ID = 'loadDatasetAccept';
export const LOAD_DATASET_CANCEL_BUTTON_ID = 'loadDatasetCancelButton';
export const buildDatasetsListNameClass = (name) =>
  `datasetsListName-${parseName(name)}`;
export const buildDatasetsListDescriptionClass = (name) =>
  `datasetsListDescription-${parseName(name)}`;
export const buildDatasetsListViewButtonClass = (name) =>
  `datasetsListViewButton-${parseName(name)}`;
export const buildDatasetsListDeleteButtonClass = (name) =>
  `datasetsListDeleteButton-${parseName(name)}`;
export const DATASET_BACK_BUTTON_ID = 'datasetBackButton';
export const DATASET_NAME_ID = 'datasetName';
export const DATASETS_MAIN_ID = 'datasetsMain';
export const DATASET_TABLE_ID = 'datasetTable';
export const DATASET_TABLE_INFORMATION_ID = 'datasetTableInformation';
export const DATASET_TABLE_SPACE_ID_ID = 'datasetTableSpaceId';
export const DATASET_TABLE_SPACE_NAME_ID = 'datasetTableSpaceName';
export const DATASET_TABLE_SUBSPACE_COUNT_ID = 'datasetTableSubspaceCount';
export const DATASET_TABLE_ACTION_COUNT_ID = 'datasetTableActionCount';
export const DATASET_TABLE_USER_COUNT_ID = 'datasetTableUserCount';
export const DATASET_TABLE_COUNTRY_COUNT_ID = 'datasetTableCountryCount';
export const VISUALIZATIONS_MENU_ITEM_ID = 'visualizationsMenuItem';
export const EXECUTIONS_ALERT_NO_DATASET_ID = 'executionsNoDatasetAlert';
export const EXECUTIONS_DATASETS_SELECT_ID = 'executionsDatasetSelect';
export const EXECUTIONS_ALGORITHMS_SELECT_ID = 'executionsAlgorithmsSelect';
export const EXECUTIONS_EXECUTE_BUTTON_ID = 'executionsExecuteButton';
export const EXECUTIONS_TABLE_ID = 'executionsTable';
export const EXECUTIONS_MAIN_ID = 'executionsMain';
export const buildExecutionDatasetOptionId = (id) =>
  `executionsDatasetOption-${id}`;
export const buildExecutionAlgorithmOptionId = (id) =>
  `executionsAlgorithmOption-${id}`;
export const RESULTS_MAIN_ID = 'resultsMain';
export const EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS =
  'executionsExecutionDeleteButton';
export const EXECUTIONS_EXECUTION_CANCEL_BUTTON_CLASS =
  'executionsExecutionCancelButton';
export const buildExecutionRowSourceButtonId = (id) =>
  `executionRowSourceButton-${id}`;
export const buildExecutionRowAlgorithmButtonId = (id) =>
  `executionRowAlgorithmButton-${id}`;
export const EDIT_ALGORITHM_MAIN_ID = 'editAlgorithmMain';
export const DATASET_SCREEN_MAIN_ID = 'datasetScreenMain';
export const EXECUTION_TABLE_ROW_BUTTON_CLASS = 'executionTableRowButton';
export const EXECUTION_FORM_NAME_INPUT_ID = 'executionFormNameInput';
export const ALGORITHM_TABLE_ID = 'algorithmTable';
export const ALGORITHM_NAME_CLASS = 'algorithmName';
export const ALGORITHM_DELETE_CLASS = 'algorithmDelete';
export const buildAlgorithmRowClass = (name) =>
  `algorithmRow-${parseName(name)}`;
export const ALGORITHM_DESCRIPTION_CLASS = 'algorithmDescription';
export const ALGORITHM_AUTHOR_CLASS = 'algorithmAuthor';
export const ALGORITHM_LANGUAGE_CLASS = 'algorithmLanguage';
