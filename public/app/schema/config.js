const { GRAASP_SCHEMA_ID } = require('../../shared/constants');
const GRAASP_SCHEMA = require('./graasp');

const now = Date.now();
const DEFAULT_SCHEMAS = {
  [GRAASP_SCHEMA_ID]: {
    id: GRAASP_SCHEMA_ID,
    label: 'Graasp',
    description: 'Schema for datasets gathered from the Graasp ecosystem',
    schema: GRAASP_SCHEMA,
    tagStyle: {
      backgroundColor: '#5050d2',
      color: 'white',
    },
    createdAt: now,
    lastModified: now,
  },
};

module.exports = { DEFAULT_SCHEMAS };
