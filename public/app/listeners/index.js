const { loadDataset } = require('./loadDataset');
const {
  cancelExecutionObject,
  executeAlgorithm,
} = require('./executeAlgorithm');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const getDataset = require('./getDataset');
const getDatasets = require('./getDatasets');
const setDatabase = require('./setDatabase');
const deleteDataset = require('./deleteDataset');
const setSampleDatabase = require('./setSampleDatabase');
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
const exportDataset = require('./exportDataset');
const showSaveAsPrompt = require('./showSaveAsPrompt');
const exportResult = require('./exportResult');
const getAlgorithm = require('./getAlgorithm');
const saveAlgorithm = require('./saveAlgorithm');
const addAlgorithm = require('./addAlgorithm');
const browseFile = require('./browseFile');
const getUtils = require('./getUtils');
const saveUtils = require('./saveUtils');
const getExecutions = require('./getExecutions');
const deleteExecution = require('./deleteExecution');
const createExecution = require('./createExecution');
const {
  cancelExecution,
  cancelAllRunningExecutions,
} = require('./cancelExecution');

module.exports = {
  getDataset,
  getDatasets,
  deleteDataset,
  executeAlgorithm,
  executePythonAlgorithm,
  loadDataset,
  setDatabase,
  setSampleDatabase,
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
  cancelAllRunningExecutions,
  cancelExecution,
};
