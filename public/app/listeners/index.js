const showLoadDatasetPrompt = require('./showLoadDatasetPrompt');
const { loadDataset } = require('./loadDataset');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const getDataset = require('./getDataset');
const getDatasets = require('./getDatasets');
const setDatabase = require('./setDatabase');
const deleteDataset = require('./deleteDataset');
const setSampleDatabase = require('./setSampleDatabase');

module.exports = {
  getDataset,
  getDatasets,
  deleteDataset,
  showLoadDatasetPrompt,
  executePythonAlgorithm,
  loadDataset,
  setDatabase,
  setSampleDatabase,
};
