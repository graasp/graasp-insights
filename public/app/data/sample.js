const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
} = require('../db');
const { SAMPLE_DATASET_FILEPATH } = require('../config/config');
const { SCHEMA_TYPES, DATASET_TYPES } = require('../../shared/constants');

module.exports = {
  [DATASETS_COLLECTION]: [
    {
      id: '1234',
      name: 'my dataset',
      filepath: SAMPLE_DATASET_FILEPATH,
      size: 45,
      createdAt: Date.now(),
      lastModified: Date.now(),
      schemaType: SCHEMA_TYPES.GRAASP,
      type: DATASET_TYPES.SOURCE,
    },
  ],
  [ALGORITHMS_COLLECTION]: [],
  [EXECUTIONS_COLLECTION]: [],
};
