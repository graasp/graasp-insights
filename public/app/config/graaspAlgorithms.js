const _ = require('lodash');
const {
  PROGRAMMING_LANGUAGES,
  AUTHORS,
  PARAMETER_TYPES,
  SCHEMA_TYPES,
} = require('../../shared/constants');
const { ALGORITHM_TYPES } = require('../../shared/constants');
const { generateFieldSelector } = require('../../shared/utils');
const GRAASP_SCHEMA = require('../schema/graasp');

const updateObjectValues = (schema, newValues) => {
  if (_.isObject(schema) && _.isObject(newValues)) {
    return {
      ...schema,
      ...Object.fromEntries(
        Object.entries(newValues).map(([key, value]) =>
          key in schema
            ? [key, updateObjectValues(schema[key], value)]
            : [key, value],
        ),
      ),
    };
  }
  return newValues;
};

const GRAASP_ALGORITHMS = [
  {
    id: 'hash-fields',
    name: 'Hash fields',
    description: 'Select and hash fields from a dataset',
    filename: 'hash_fields.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'hashed_fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        description: 'Select fields to hash',
        value: {
          [SCHEMA_TYPES.GRAASP]: updateObjectValues(
            generateFieldSelector(GRAASP_SCHEMA),
            {
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
            },
          ),
        },
      },
    ],
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
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least k users containing that combination.
    The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    filename: 'k_anonymize_geolocations.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'k',
        type: PARAMETER_TYPES.INTEGER_INPUT,
        description: 'Select parameter k for k-anonymization',
        value: 2,
      },
    ],
  },
  {
    id: 'suppress-fields',
    name: 'Suppress fields',
    description: 'Select and suppress fields from a dataset',
    filename: 'suppress_fields.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
    parameters: [
      {
        name: 'suppressed_fields',
        type: PARAMETER_TYPES.FIELD_SELECTOR,
        description: 'Select fields to suppress',
        value: {
          [SCHEMA_TYPES.GRAASP]: updateObjectValues(
            generateFieldSelector(GRAASP_SCHEMA),
            {
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
            },
          ),
        },
      },
    ],
  },
];

module.exports = GRAASP_ALGORITHMS;
