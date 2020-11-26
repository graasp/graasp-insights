// this file needs to use module.s as it is used both by react and electron
// the original file is located in src/shared and is duplicated in public/shared

const ALGORITHM_TYPES = {
  ANONYMIZATION: 'anonymization',
  UTILS: 'utils',
  VISUALIZATION: 'visualization',
};

const APP_BACKGROUND_COLOR = '#F7F7F7';

const SCHEMA_TYPES = {
  GRAASP: 'GRAASP',
  NONE: 'NONE',
};

module.exports = {
  ALGORITHM_TYPES,
  APP_BACKGROUND_COLOR,
  SCHEMA_TYPES,
};
