const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../db');
const { SAMPLE_DATASET_FILEPATH } = require('../config/paths');
const { GRAASP_SCHEMA_ID, DATASET_TYPES } = require('../../shared/constants');
const { DEFAULT_SCHEMAS } = require('../config/config');

module.exports = {
  [DATASETS_COLLECTION]: [
    {
      id: '1234',
      name: 'my dataset',
      filepath: SAMPLE_DATASET_FILEPATH,
      size: 45,
      createdAt: Date.now(),
      lastModified: Date.now(),
      schemaId: GRAASP_SCHEMA_ID,
      type: DATASET_TYPES.SOURCE,
    },
  ],
  [ALGORITHMS_COLLECTION]: [],
  [EXECUTIONS_COLLECTION]: [],
  [SCHEMAS_COLLECTION]: DEFAULT_SCHEMAS,
};
