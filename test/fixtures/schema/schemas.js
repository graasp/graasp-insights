const { SIMPLE_DATASET, DATASET_FOR_SCHEMA } = require('../datasets/datasets');

const INITIAL_UNDEFINED_SCHEMA = {
  id: 'undefined-schema',
  label: 'Undefined Schema',
  description: 'undefined schema definition',
  schema: undefined,
  tagStyle: {
    backgroundColor: '#eeeeee',
    color: 'black',
  },
};
const INITIAL_CORRUPTED_SCHEMA = {
  id: 'corrupted-schema',
  label: 'Corrupted Schema',
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

const SCHEMAS_FROM_DATASET = [
  {
    label: 'From dataset 1',
    description: 'Schema generated from a dataset 1',
    fromDataset: SIMPLE_DATASET.name,
  },

  {
    label: 'From dataset 2',
    description: 'Schema generated from a dataset 2',
    fromDataset: DATASET_FOR_SCHEMA.name,
  },
];

module.exports = {
  BLANK_SCHEMA,
  REPLACEMENT_SCHEMA,
  SCHEMAS_FROM_DATASET,
  INITIAL_CORRUPTED_SCHEMA,
  INITIAL_UNDEFINED_SCHEMA,
};
