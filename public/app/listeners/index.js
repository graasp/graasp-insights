const { loadDataset } = require('./loadDataset');
const { cancelExecutionById, executeAlgorithm } = require('./executeAlgorithm');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const getDataset = require('./getDataset');
const getDatasets = require('./getDatasets');
const setDatabase = require('./setDatabase');
const deleteDataset = require('./deleteDataset');
const setGraaspDatabase = require('./setGraaspDatabase');
const setLanguage = require('./setLanguage');
const getLanguage = require('./getLanguage');
const getResult = require('./getResult');
const getResults = require('./getResults');
const deleteResult = require('./deleteResult');
const getAlgorithms = require('./getAlgorithms');
const deleteAlgorithm = require('./deleteAlgorithm');
const getDatabase = require('./getDatabase');
const setDatasetFile = require('./setDatasetFile');
const checkPythonInstallation = require('./checkPythonInstallation');
const { exportDataset } = require('./exportDataset');
const showSaveAsPrompt = require('./showSaveAsPrompt');
const exportResult = require('./exportResult');
const getAlgorithm = require('./getAlgorithm');
const saveAlgorithm = require('./saveAlgorithm');
const { addAlgorithm, addPythonAlgorithmInDb } = require('./addAlgorithm');
const browseFile = require('./browseFile');
const getUtils = require('./getUtils');
const saveUtils = require('./saveUtils');
const getExecutions = require('./getExecutions');
const deleteExecution = require('./deleteExecution');
const { createExecution, addExecutionObject } = require('./createExecution');
const {
  cancelExecution,
  cancelExecutionObject,
  cancelAllRunningExecutions,
} = require('./cancelExecution');
const showConfirmDeletePrompt = require('./showConfirmDeletePrompt');
const showConfirmClearDatabasePrompt = require('./showConfirmClearDatabasePrompt');
const { clearDatabase, clearDatabaseUtil } = require('./clearDatabase');
const setFileSizeLimit = require('./setFileSizeLimit');
const getFileSizeLimit = require('./getFileSizeLimit');
const getSettings = require('./getSettings');
const showConfirmOpenDatasetPrompt = require('./showConfirmOpenDatasetPrompt');
const openPath = require('./openPath');
const getSchemas = require('./getSchemas');
const { setSchema, saveSchemaInDb } = require('./setSchema');
const deleteSchema = require('./deleteSchema');
const openUrlInBrowser = require('./openUrlInBrowser');
const getAlgorithmCode = require('./getAlgorithmCode');
const {
  addDefaultAlgorithm,
  saveDefaultAlgorithmInDb,
} = require('./addDefaultAlgorithm');
const getPipelines = require('./getPipelines');
const getPipeline = require('./getPipeline');
const savePipeline = require('./savePipeline');
const addPipeline = require('./addPipeline');
const deletePipeline = require('./deletePipeline');
const getExecution = require('./getExecution');
const createValidation = require('./createValidation');
const deleteValidation = require('./deleteValidation');
const getValidations = require('./getValidations');
const showResetTemplatePrompt = require('./showResetTemplatePrompt');
const executePipeline = require('./executePipeline');

module.exports = {
  getDataset,
  getDatasets,
  deleteDataset,
  executeAlgorithm,
  executePythonAlgorithm,
  loadDataset,
  setDatabase,
  setGraaspDatabase,
  setLanguage,
  getLanguage,
  getResult,
  getResults,
  deleteResult,
  getAlgorithms,
  deleteAlgorithm,
  getDatabase,
  checkPythonInstallation,
  exportDataset,
  showSaveAsPrompt,
  exportResult,
  setDatasetFile,
  getAlgorithm,
  saveAlgorithm,
  addAlgorithm,
  browseFile,
  getUtils,
  saveUtils,
  getExecutions,
  deleteExecution,
  createExecution,
  cancelExecutionObject,
  addExecutionObject,
  cancelExecutionById,
  cancelAllRunningExecutions,
  cancelExecution,
  showConfirmDeletePrompt,
  showConfirmClearDatabasePrompt,
  clearDatabase,
  setFileSizeLimit,
  getFileSizeLimit,
  getSettings,
  showConfirmOpenDatasetPrompt,
  openPath,
  getSchemas,
  setSchema,
  deleteSchema,
  openUrlInBrowser,
  getAlgorithmCode,
  addDefaultAlgorithm,
  saveDefaultAlgorithmInDb,
  addPythonAlgorithmInDb,
  clearDatabaseUtil,
  saveSchemaInDb,
  getPipelines,
  getPipeline,
  savePipeline,
  addPipeline,
  deletePipeline,
  getExecution,
  createValidation,
  deleteValidation,
  getValidations,
  showResetTemplatePrompt,
  executePipeline,
};
