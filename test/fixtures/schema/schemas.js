const { SIMPLE_DATASET } = require('../datasets/datasets');

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

module.exports = { BLANK_SCHEMA, REPLACEMENT_SCHEMA, SCHEMA_FROM_DATASET };
