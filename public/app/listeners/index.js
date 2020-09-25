const showLoadDatasetPrompt = require('./showLoadDatasetPrompt');
const { loadDataset } = require('./loadDataset');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const getDataset = require('./getDataset');
const getDatasets = require('./getDatasets');
const setDatabase = require('./setDatabase');

module.exports = {
  getDataset,
  getDatasets,
  showLoadDatasetPrompt,
  executePythonAlgorithm,
  loadDataset,
  setDatabase,
};
