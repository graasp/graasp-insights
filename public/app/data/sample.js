const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  SCHEMAS_COLLECTION,
} = require('../db');
const { SAMPLE_DATASET_FILEPATH } = require('../config/paths');
const { SCHEMA_TYPES, DATASET_TYPES } = require('../../shared/constants');
const GRRAASP_SCHEMA = require('../schema/graasp');

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
  [SCHEMAS_COLLECTION]: [{ type: SCHEMA_TYPES.GRAASP, schema: GRRAASP_SCHEMA }],
};
