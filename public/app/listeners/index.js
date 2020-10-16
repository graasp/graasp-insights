const showLoadDatasetPrompt = require('./showLoadDatasetPrompt');
const { loadDataset } = require('./loadDataset');
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

module.exports = {
  getDataset,
  getDatasets,
  deleteDataset,
  showLoadDatasetPrompt,
  executePythonAlgorithm,
  loadDataset,
  setDatabase,
  setSampleDatabase,
  setLanguage,
  getLanguage,
  getResult,
  getResults,
  deleteResult,
};
