const parseName = (name) => name.split(' ').join('');

export const ALGORITHMS_MENU_ITEM_ID = 'algorithmsMenuItem';
export const DATASETS_MENU_ITEM_ID = 'datasetsMenuItem';
export const DRAWER_BUTTON_ID = 'drawerButton';
export const QUIT_MENU_ITEM_ID = 'quitMenuItem';
export const EXECUTIONS_MENU_ITEM_ID = 'executionsMenuItem';
export const RESULTS_MENU_ITEM_ID = 'resultsMenuItem';
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
export const DATASET_TABLE_INFORMATION_ID = 'datasetTableInformation';
export const DATASET_TABLE_SPACE_ID_ID = 'datasetTableSpaceId';
export const DATASET_TABLE_SPACE_NAME_ID = 'datasetTableSpaceName';
export const DATASET_TABLE_SUBSPACE_COUNT_ID = 'datasetTableSubspaceCount';
export const DATASET_TABLE_ACTION_COUNT_ID = 'datasetTableActionCount';
export const DATASET_TABLE_USER_COUNT_ID = 'datasetTableUserCount';
export const DATASET_TABLE_COUNTRY_COUNT_ID = 'datasetTableCountryCount';
export const VISUALIZATIONS_MENU_ITEM_ID = 'visualizationsMenuItem';
