const { DATASETS_COLLECTION, RESULTS_COLLECTION } = require('../db');
const { SAMPLE_DATASET_FILEPATH } = require('../config/config');

module.exports = {
  [DATASETS_COLLECTION]: [
    {
      id: '1234',
      name: 'my dataset',
      filepath: SAMPLE_DATASET_FILEPATH,
      size: 45,
      createdAt: Date.now(),
      lastModified: Date.now(),
    },
  ],
  [RESULTS_COLLECTION]: [],
};
