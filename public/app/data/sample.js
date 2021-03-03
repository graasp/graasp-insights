const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SETTINGS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../db');
const { SAMPLE_DATASET_FILEPATH } = require('../config/paths');
const {
  GRAASP_SCHEMA_ID,
  DATASET_TYPES,
  DEFAULT_FILE_SIZE_LIMIT,
} = require('../../shared/constants');
const { DEFAULT_SCHEMAS } = require('../schema/config');

module.exports = {
  [DATASETS_COLLECTION]: [
    {
      id: '1234',
      name: 'my dataset',
      filepath: SAMPLE_DATASET_FILEPATH,
      size: 45,
      createdAt: Date.now(),
      lastModified: Date.now(),
      schemaIds: [GRAASP_SCHEMA_ID],
      type: DATASET_TYPES.SOURCE,
    },
  ],
  [ALGORITHMS_COLLECTION]: [],
  [EXECUTIONS_COLLECTION]: [],
  [SETTINGS_COLLECTION]: {
    fileSizeLimit: DEFAULT_FILE_SIZE_LIMIT,
  },
  [SCHEMAS_COLLECTION]: DEFAULT_SCHEMAS,
};
