const _ = require('lodash');
const {
  PROGRAMMING_LANGUAGES,
  AUTHORS,
  PARAMETER_TYPES,
} = require('../../shared/constants');
const { ALGORITHM_TYPES, GRAASP_SCHEMA_ID } = require('../../shared/constants');
const { generateFieldSelector } = require('../../shared/utils');
const GRAASP_SCHEMA = require('../schema/graasp');

const GRAASP_ALGORITHMS = [
  {
    id: 'hash-users',
    name: 'Hash users',
    description:
      "Hash every occurrence of the 'userId' field in 'actions', 'appInstanceResources', and 'users', and remove all other identifying information from the 'users' key",
    filename: 'hash_users.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'hash-fields',
    name: 'Hash fields',
    description: 'Perform a SHA-256 hash on selected fields from a dataset',
    filename: 'hash_fields.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        description: 'Select fields to hash:',
        value: {
          [GRAASP_SCHEMA_ID]: _.merge(generateFieldSelector(GRAASP_SCHEMA), {
            properties: {
              data: {
                properties: {
                  actions: {
                    items: {
                      properties: {
                        user: { selected: true },
                      },
                    },
                  },
                  users: {
                    items: {
                      properties: {
                        _id: { selected: true },
                      },
                    },
                  },
                  appInstanceResources: {
                    items: {
                      properties: {
                        user: { selected: true },
                      },
                    },
                  },
                },
              },
            },
          }),
        },
      },
    ],
  },
  {
    id: 'sanitize-users',
    name: 'Sanitize users',
    description:
      "Scan an entire dataset for occurrences of user names and user ids, and replace such occurrences with a SHA-256 hash of the corresponding user's userId",
    filename: 'sanitize_users.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [],
  },
  {
    id: 'k-anonymize-geolocation',
    name: 'k-Anonymize geolocation',
    description:
      "Ensure that for every combination of 'country', 'region', and 'city', there are at least k users containing that combination",
    filename: 'k_anonymize_geolocations.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'k',
        type: PARAMETER_TYPES.INTEGER_INPUT,
        description: 'Select parameter k for k-anonymization:',
        value: 2,
      },
    ],
  },
  {
    id: 'suppress-fields',
    name: 'Suppress fields',
    description: 'Completely remove selected fields from a dataset',
    filename: 'suppress_fields.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        description: 'Select fields to suppress:',
        value: {
          [GRAASP_SCHEMA_ID]: _.merge(generateFieldSelector(GRAASP_SCHEMA), {
            properties: {
              data: {
                properties: {
                  actions: {
                    items: {
                      properties: {
                        data: { selected: true },
                        geolocation: { selected: true },
                      },
                    },
                  },
                  appInstances: {
                    items: {
                      properties: {
                        settings: { selected: true },
                      },
                    },
                  },
                  appInstanceResources: {
                    items: {
                      properties: {
                        data: { selected: true },
                      },
                    },
                  },
                },
              },
            },
          }),
        },
      },
    ],
  },
  {
    id: 'shuffle-fields',
    name: 'Shuffle fields',
    description: 'Shuffle selected array fields from a dataset',
    filename: 'shuffle_fields.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        description: 'Select fields to shuffle:',
        value: {
          [GRAASP_SCHEMA_ID]: _.merge(generateFieldSelector(GRAASP_SCHEMA), {
            properties: {
              data: {
                properties: {
                  actions: {
                    items: {
                      properties: {
                        verb: { selected: true },
                        geolocation: { selected: true },
                      },
                    },
                  },
                },
              },
            },
          }),
        },
      },
    ],
  },
];

module.exports = GRAASP_ALGORITHMS;
