const { SIMPLE_DATASET } = require('../datasets/datasets');

const INITIAL_UNDEFINED_SCHEMA = {
  id: 'undefined-schema',
  label: 'Graasp',
  description: 'undefined schema definition',
  schema: undefined,
  tagStyle: {
    backgroundColor: '#eeeeee',
    color: 'black',
  },
};
const INITIAL_CORRUPTED_SCHEMA = {
  id: 'corrupted-schema',
  label: 'Graasp',
  description: 'corrupted schema definition',
  schema: { some: 'schema' },
  tagStyle: {
    backgroundColor: 'pink',
    color: 'black',
  },
};

const BLANK_SCHEMA = {
  label: 'Blank',
  description: 'Blank schema description',
};

const REPLACEMENT_SCHEMA = {
  label: 'Replaced',
  description: 'Schema that has been replaced',
};

const SCHEMA_FROM_DATASET = {
  label: 'From dataset',
  description: 'Schema generated from a dataset',
  fromDataset: SIMPLE_DATASET.name,
};

module.exports = {
  BLANK_SCHEMA,
  REPLACEMENT_SCHEMA,
  SCHEMA_FROM_DATASET,
  INITIAL_CORRUPTED_SCHEMA,
  INITIAL_UNDEFINED_SCHEMA,
};
