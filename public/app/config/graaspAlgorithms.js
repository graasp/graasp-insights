const {
  PROGRAMMING_LANGUAGES,
  AUTHORS,
  PARAMETER_TYPES,
} = require('../../shared/constants');
const defaultFieldSelectorParameters = require('../../shared/defaultFieldSelectorParameters');
const { ALGORITHM_TYPES } = require('../../shared/constants');

const GRAASP_ALGORITHMS = [
  {
    id: 'hash-users',
    name: 'Hash users',
    description:
      "Hash the userId field from the 'actions' and 'appInstanceResources'",
    filename: 'hash_users.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [],
  },
  {
    id: 'sanitize-users',
    name: 'Sanitize users',
    description:
      'Scan the dataset for occurrences of user names and user IDs, and replace such occurrences with a hash of the corresponding user ID',
    filename: 'sanitize_users.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [],
  },
  {
    id: 'k-anonymize-geolocation',
    name: 'k-Anonymize geolocation',
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least two users containing that combination.
    The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    filename: 'k_anonymize_geolocations.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'k',
        type: PARAMETER_TYPES.INTEGER_INPUT,
        value: 2,
      },
    ],
  },
  {
    id: 'suppress-fields',
    name: 'Suppress fields',
    description: 'Select and suppress fields from a dataset',
    filename: 'suppress.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'suppressed_fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        value: defaultFieldSelectorParameters,
      },
    ],
  },
];

module.exports = GRAASP_ALGORITHMS;
