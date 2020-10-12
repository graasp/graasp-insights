const { DATASETS_COLLECTION, RESULTS_COLLECTION, ALGORITHMS_COLLECTION } = require('../db');
const { SAMPLE_DATASET_FILEPATH, GRAASP_ALGORITHMS } = require('../config/config');

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
  [ALGORITHMS_COLLECTION]: GRAASP_ALGORITHMS,
};
