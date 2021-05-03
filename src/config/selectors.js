const parseName = (name) => name?.split(' ').join('');

export const SETTINGS_MENU_ITEM_ID = 'settingsMenuItem';
export const ALGORITHMS_MENU_ITEM_ID = 'algorithmsMenuItem';
export const DATASETS_MENU_ITEM_ID = 'datasetsMenuItem';
export const RESULTS_MENU_ITEM_ID = 'resultsMenuItem';
export const DRAWER_BUTTON_ID = 'drawerButton';
export const QUIT_MENU_ITEM_ID = 'quitMenuItem';
export const EXECUTIONS_MENU_ITEM_ID = 'executionsMenuItem';
export const PIPELINES_MENU_ITEM_ID = 'pipelinesMenuItem';
export const SCHEMAS_MENU_ITEM_ID = 'schemasMenuItem';
export const VALIDATION_MENU_ITEM_ID = 'validationMenuItem';
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
export const buildExecutionSourceButtonId = (id) =>
  `executionRowSourceButton-${id}`;
export const buildExecutionAlgorithmButtonId = (id) =>
  `executionRowAlgorithmButton-${id}`;
export const buildExecutionResultButtonId = (id) =>
  `executionRowAResultButton-${id}`;
export const EDIT_ALGORITHM_MAIN_ID = 'editAlgorithmMain';
export const DATASET_SCREEN_MAIN_ID = 'datasetScreenMain';
export const EXECUTION_TABLE_ROW_BUTTON_CLASS = 'executionTableRowButton';
export const EXECUTION_FORM_NAME_INPUT_ID = 'executionFormNameInput';
export const ALGORITHM_TABLE_ID = 'algorithmTable';
export const ALGORITHM_NAME_CLASS = 'algorithmName';
export const ALGORITHM_DELETE_BUTTON_CLASS = 'algorithmDeleteButton';
export const buildAlgorithmRowClass = (name) =>
  `algorithmRow-${parseName(name)}`;
export const ALGORITHM_DESCRIPTION_CLASS = 'algorithmDescription';
export const ALGORITHM_ADD_BUTTON_ID = 'algorithmAddButton';
export const ALGORITHM_EDIT_BUTTON_CLASS = 'algorithmEditButton';
export const ALGORITHM_TYPE_SELECT_ID = 'algorithmTypeSelect';
export const buildAlgorithmTypeOptionId = (type) =>
  `algorithmTypeOption-${parseName(type)}`;
export const ADD_ALGORITHM_NAME_ID = 'addAlgorithmName';
export const ADD_ALGORITHM_DESCRIPTION_ID = 'addAlgorithmDescription';
export const ADD_ALGORITHM_TYPE_SELECT_ID = 'addAlgorithmTypeSelect';
export const buildAddAlgorithmTypeOptionId = (type) =>
  `addAlgorithmTypeOption-${parseName(type)}`;
export const ADD_ALGORITHM_FILE_LOCATION_ID = 'addAlgorithmFileLocation';
export const ADD_ALGORITHM_SAVE_BUTTON_ID = 'addAlgorithmSaveButton';
export const ADD_ALGORITHM_BACK_BUTTON_ID = 'addAlgorithmBackButton';
export const ADD_ALGORITHM_FROM_FILE_OPTION_ID = 'addAlgorithmFromFileOption';
export const ADD_ALGORITHM_FROM_EDITOR_OPTION_ID =
  'addAlgorithmFromEditorOption';
export const ADD_ALGORITHM_DEFAULT_OPTION_ID = 'addAlgorithmDefaultOption';
export const EDIT_ALGORITHM_NAME_ID = 'editAlgorithmName';
export const EDIT_ALGORITHM_DESCRIPTION_ID = 'editAlgorithmDescription';
export const EDIT_ALGORITHM_TYPE_SELECT_ID = 'editAlgorithmTypeSelect';
export const buildEditAlgorithmTypeOptionId = (type) =>
  `editAlgorithmTypeOption-${parseName(type)}`;
export const EDIT_ALGORITHM_SAVE_BUTTON_ID = 'editAlgorithmSaveButton';
export const EDIT_ALGORITHM_BACK_BUTTON_ID = 'editAlgorithmBackButton';
export const SETTINGS_BUTTON_ID = 'settingsButton';
export const SETTINGS_FILE_SIZE_LIMIT_SELECT_ID = 'settingsFileSizeLimitSelect';
export const SETTINGS_LANG_SELECT = 'settingsLangSelect';
export const SETTINGS_MAIN_ID = 'settingsMain';
export const PARAMETER_CLASS = 'parameter';
export const PARAMETER_NAME_CLASS = 'parameterName';
export const PARAMETER_TYPE_CLASS = 'parameterType';
export const PARAMETER_DESCRIPTION_CLASS = 'parameterDescription';
export const PARAMETER_VALUE_CLASS = 'parameterValue';
export const ADD_PARAMETER_BUTTON_ID = 'addParameter';
export const buildParameterTypeOptionClass = (type) =>
  `parameterTypeOption-${parseName(type)}`;
export const SET_PARAMETERS_BUTTON_ID = 'setParametersButton';
export const SET_PARAMETERS_SAVE_BUTTON_ID = 'setParametersSaveButton';
export const SET_PARAMETERS_BACK_BUTTON_ID = 'setParametersBackButton';
export const buildParameterValueInputId = (name) =>
  `parameterValueInput-${name}`;
export const SCHEMAS_TABLE_ID = 'schemasTable';
export const buildSchemaRowClass = (name) => `schemaRow-${parseName(name)}`;
export const SCHEMAS_ADD_BUTTON_ID = 'schemasAddButton';
export const SCHEMAS_VIEW_SCHEMA_BUTTON_CLASS = 'schemasViewSchemaButton';
export const SCHEMAS_DELETE_SCHEMA_BUTTON_CLASS = 'schemasDeleteSchemaButton';
export const SCHEMA_VIEW_LABEL_ID = 'schemaViewLabel';
export const SCHEMA_VIEW_DESCRIPTION_ID = 'schemaViewDescription';
export const ADD_SCHEMA_LABEL_ID = 'addSchemaLabel';
export const ADD_SCHEMA_DESCRIPTION_ID = 'addSchemaDescription';
export const ADD_SCHEMA_FROM_DATASET_SELECT_ID = 'addSchemaFromDatasetSelect';
export const buildDatasetOptionClass = (name) =>
  `datasetOption-${parseName(name)}`;
export const ADD_SCHEMA_CANCEL_BUTTON_ID = 'addSchemaCancelButton';
export const ADD_SCHEMA_CONFIRM_BUTTON_ID = 'addSchemaConfirmButton';
export const buildSchemaTagClass = (label) => `schemaTag-${parseName(label)}`;
export const SCHEMA_DESCRIPTION_CLASS = 'schemaDescription';
export const SCHEMA_VIEW_SAVE_BUTTON_ID = 'schemaViewSaveButton';
export const SCHEMA_VIEW_BACK_BUTTON_ID = 'schemaViewBackButton';
export const buildDatasetRowClass = (name) => `datasetRow-${parseName(name)}`;
export const DEFAULT_ALGORITHM_SELECT_ID = 'defaultAlgorithmSelect';
export const buildDefaultAlgorithmOptionId = (id) =>
  `defaultAlgorithmOption-${id}`;
export const buildAlertFieldSelectorUndefinedSchema = (id) =>
  `alertFieldSelectorUndefinedSchema-${id}`;
export const ALERT_FIELD_SELECTOR_NO_SCHEMA_AVAILABLE_ID =
  'alertFieldSelectorNoSchemaAvailable';
export const PARAMETERS_FIELD_SELECTOR_SELECT_SCHEMAS_ID =
  'parametersFieldSelectorSelectSchemas';
export const buildParameterSchemaOption = (id) => `parameterSchemaOption-${id}`;
export const buildFieldSelectorCheckbox = (name) =>
  `fieldSelectorCheckbox-${name}`;
export const SETTINGS_CLEAR_DATABASE_BUTTON_ID = 'settingsClearDatabaseButton';
export const ALGORITHMS_EMPTY_ALERT_ID = 'algorithmsEmptyAlert';
export const SCHEMAS_EMPTY_ALERT_ID = 'schemasEmptyAlert';
export const SETTINGS_CLEAR_DATABASE_SAMPLE_DB_CHECKBOX_ID =
  'settingsClearDatavaseSampleDbCheckbox';
export const SETTINGS_LOAD_GRAASP_DATABASE_ID = 'settingsLoadGraaspDatabase';
export const SCHEMA_CONTENT_ID = 'schemaContent';
export const EDIT_PIPELINE_NAME_ID = 'editPipelineName';
export const EDIT_PIPELINE_DESCRIPTION_ID = 'editPipelineDescription';
export const PIPELINE_FORM_SAVE_BUTTON_ID = 'pipelineFormSaveButton';
export const EDIT_PIPELINE_BACK_BUTTON_ID = 'editPipelineBackButton';
export const ADD_PIPELINE_BACK_BUTTON_ID = 'addPipelineBackButton';
export const PIPELINE_DELETE_BUTTON_CLASS = 'pipelineDeleteButton';
export const buildPipelineRowClass = (name) => `pipelineRow-${parseName(name)}`;
export const PIPELINE_EXECUTION_BUTTON_CLASS = 'pipelineExecutionButton';
export const PIPELINE_NAME_CLASS = 'pipelineName';
export const PIPELINE_TABLE_ID = 'pipelineTable';
export const PIPELINE_ADD_BUTTON_ID = 'pipelineAddButton';
export const PIPELINE_EDIT_BUTTON_CLASS = 'pipelineEditButton';
export const ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID =
  'addAlgorithmPipelineAccordionButton';
export const ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID =
  'algorithmDialogPipelineAccordionSelect';
export const CANCEL_ADD_ALGORITHM_PIPELINE_ACCORDION_ID =
  'cancelAddAlgorithmPipelineAccordion';
export const CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID =
  'confirmAddAlgorithmPipelineAccordion';
export const buildPanelAlgorithmPipelineAccordionId = (id) =>
  `panel${id}-accordion`;
export const buildRemoveAlgorithmPipelineAccordionButtonId = (id) =>
  `button${id}-remove`;
export const buildPanelTypographyAlgorithmId = (id, i) => `algorithm${i}-${id}`;
export const buildExecutionViewButtonId = (sourceId, algoId) =>
  `executionViewButton-${sourceId}-${algoId}`;
export const EXECUTION_VIEW_LOG_ID = `executionViewLog`;
export const EXECUTION_VIEW_TABLE_ID = 'executionViewTable';
export const buildParameterId = (name) => `parameter-${parseName(name)}`;
export const VALIDATION_TABLE_ID = 'validationTable';
export const buildValidationRowClass = (datasetName, algorithmNames) =>
  `validationRow-${datasetName}-${algorithmNames.map(parseName).join('-')}`;
export const DATASET_NAME_CLASS = 'datasetName';
export const VALIDATION_EXECUTION_RESULT_CLASS = 'validationExecutionResult';
export const VALIDATION_DELETE_BUTTON_CLASS = 'validationDeleteButton';
export const VALIDATION_ADD_BUTTON_ID = 'validationAddButton';
export const ADD_VALIDATION_DATASETS_SELECT_ID = 'addValidationDatasetSelect';
export const ADD_VALIDATION_ALGORITHMS_SELECT_ID =
  'addValidationAlgorithmsSelect';
export const ADD_VALIDATION_ADD_ALGORITHM_BUTTON_ID =
  'addValidationAddAlgorithmButton';
export const buildAddValidationDatasetOptionId = (id) =>
  `addValidationDatasetOption-${id}`;
export const buildAddValidationAlgorithmOptionId = (id) =>
  `addValidationAlgorithmOption-${id}`;
export const ADD_VALIDATION_EXECUTE_BUTTON_ID = 'addValidationExecuteButton';
export const buildExecutionPipelineOptionId = (id) =>
  `executionPipelineOption-${id}`;
