const _ = require('lodash');
const {
  PROGRAMMING_LANGUAGES,
  AUTHORS,
  PARAMETER_TYPES,
} = require('../constants');
const { ALGORITHM_TYPES, GRAASP_SCHEMA_ID } = require('../constants');
const { setFieldSelectorAttributes } = require('../utils');
const GRAASP_SCHEMA = require('./graaspSchema');

const HASH_USERS = {
  id: 'hash-users',
  name: 'Hash users',
  description:
    "Hash every occurrence of the 'userId' field in 'actions', 'appInstanceResources', and 'users', and remove all other identifying information from the 'users' key",
  filename: 'hash_users.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [],
};

const HASH_FIELD_PARAMETERS_FIELDS = {
  name: 'fields',
  type: PARAMETER_TYPES.FIELD_SELECTOR,
  description: 'Select fields to hash:',
  value: {},
};
HASH_FIELD_PARAMETERS_FIELDS.value[GRAASP_SCHEMA_ID] = _.merge(
  setFieldSelectorAttributes(GRAASP_SCHEMA, false, 1),
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
  },
);
const HASH_FIELDS = {
  id: 'hash-fields',
  name: 'Hash fields',
  description: 'Perform a SHA-256 hash on selected fields from a dataset',
  filename: 'hash_fields.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [HASH_FIELD_PARAMETERS_FIELDS],
};

const K_ANONYMIZE_GEOLOCATION = {
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
};

const SANITIZE_USERS = {
  id: 'sanitize-users',
  name: 'Sanitize users',
  description:
    "Scan an entire dataset for occurrences of user names and user ids, and replace such occurrences with a SHA-256 hash of the corresponding user's userId",
  filename: 'sanitize_users.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [],
};

const SUPPRESS_FIELDS_PARAMETER_FIELDS = {
  name: 'fields',
  type: PARAMETER_TYPES.FIELD_SELECTOR,
  description: 'Select fields to suppress:',
  value: {},
};

SUPPRESS_FIELDS_PARAMETER_FIELDS.value[GRAASP_SCHEMA_ID] = _.merge(
  setFieldSelectorAttributes(GRAASP_SCHEMA, false, 1),
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
);
const SUPPRESS_FIELDS = {
  id: 'suppress-fields',
  name: 'Suppress fields',
  description: 'Completely remove selected fields from a dataset',
  filename: 'suppress_fields.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [SUPPRESS_FIELDS_PARAMETER_FIELDS],
};

const SHUFFLE_FIELDS_PARAMETER_FIELDS = {
  name: 'fields',
  type: PARAMETER_TYPES.FIELD_SELECTOR,
  description: 'Select fields to shuffle:',
  value: {},
};

SHUFFLE_FIELDS_PARAMETER_FIELDS.value[GRAASP_SCHEMA_ID] = _.merge(
  setFieldSelectorAttributes(GRAASP_SCHEMA, false, 1),
  {
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
  },
);

const SHUFFLE_FIELDS = {
  id: 'shuffle-fields',
  name: 'Shuffle fields',
  description:
    "Given an array of objects, this algorithm randomly shuffles the values in selected keys between the array's objects",
  filename: 'shuffle_fields.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.ANONYMIZATION,
  parameters: [SHUFFLE_FIELDS_PARAMETER_FIELDS],
};

// eslint-disable-next-line no-unused-vars
const VALIDATION_SUCCESS = {
  id: 'validate-success',
  name: 'Validate with a success',
  description: 'validate any dataset with a success',
  filename: 'validate_success.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: [],
};

// eslint-disable-next-line no-unused-vars
const VALIDATION_WARNING = {
  id: 'validate-warning',
  name: 'Validate with a warning',
  description: 'validate any dataset with a warning',
  filename: 'validate_warning.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: [],
};

// eslint-disable-next-line no-unused-vars
const VALIDATION_FAILURE = {
  id: 'validate-failure',
  name: 'Validate with a failure',
  description: 'validate any dataset with a failure',
  filename: 'validate_failure.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: [],
};

const VERIFY_POTENTIALLY_DANGEROUS = {
  id: 'verify-dangerous',
  name: 'Verify potentially dangerous attributes',
  description:
    'Verify if there is any potentially dangerous attribute in a Graasp dataset',
  filename: 'verify_potentially_dangerous.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: [],
};

const DETECT_USERS_PARAMETERS_FIELDS = {
  name: 'fields',
  type: PARAMETER_TYPES.FIELD_SELECTOR,
  description: 'Select fields containing the user names:',
  value: {},
};

DETECT_USERS_PARAMETERS_FIELDS.value[GRAASP_SCHEMA_ID] = _.merge(
  setFieldSelectorAttributes(GRAASP_SCHEMA, false, 1),
  {
    properties: {
      data: {
        properties: {
          users: {
            items: {
              properties: {
                name: { selected: true },
              },
            },
          },
        },
      },
    },
  },
);

const DETECT_USERS = {
  id: 'detect-users',
  name: 'Detect users',
  description:
    'Scan an entire dataset for occurrences of user names and notify their presence',
  filename: 'detect_users.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: [DETECT_USERS_PARAMETERS_FIELDS],
};

const VERIFY_KANONYMITY_PARAMETERS = [
  {
    name: 'quasi_identifiers',
    type: PARAMETER_TYPES.FIELD_SELECTOR,
    description: 'Select fields that correspond to Quasi-Identifiers:',
    value: {},
  },
  {
    name: 'k',
    type: PARAMETER_TYPES.INTEGER_INPUT,
    description: 'Select the desired parameter k to verify k-anonymization:',
    value: 2,
  },
];

const VERIFY_KANONYMITY = {
  id: 'verify-kanonymity',
  name: 'Verifiy k-anonymity',
  description:
    'By specifying the Quasi-Identifiers, verifies if the dataset is k-anonymous',
  filename: 'verify_kanonymity.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: VERIFY_KANONYMITY_PARAMETERS,
};

const VERIFY_LDIVERSITY_PARAMETERS = [
  {
    name: 'quasi_identifiers',
    type: PARAMETER_TYPES.FIELD_SELECTOR,
    description: 'Select fields that correspond to Quasi-Identifiers:',
    value: {},
  },
  {
    name: 'sensitive_attributes',
    type: PARAMETER_TYPES.FIELD_SELECTOR,
    description: 'Select fields that correspond to sensitive attributes:',
    value: {},
  },
  {
    name: 'l',
    type: PARAMETER_TYPES.INTEGER_INPUT,
    description: 'Select the desired parameter l to verify l-diversity:',
    value: 2,
  },
];

const VERIFY_LDIVERSITY = {
  id: 'verify-ldiversity',
  name: 'Verifiy l-diversity',
  description:
    'By specifying the Quasi-Identifiers and Sensitive Attributes, verifies if the dataset is l-diversified',
  filename: 'verify_ldiversity.py',
  author: AUTHORS.GRAASP,
  language: PROGRAMMING_LANGUAGES.PYTHON,
  type: ALGORITHM_TYPES.VALIDATION,
  parameters: VERIFY_LDIVERSITY_PARAMETERS,
};

const GRAASP_ALGORITHMS = [
  HASH_USERS,
  HASH_FIELDS,
  SANITIZE_USERS,
  K_ANONYMIZE_GEOLOCATION,
  SUPPRESS_FIELDS,
  SHUFFLE_FIELDS,
  // VALIDATION_SUCCESS,
  // VALIDATION_WARNING,
  // VALIDATION_FAILURE,
  VERIFY_POTENTIALLY_DANGEROUS,
  DETECT_USERS,
  VERIFY_KANONYMITY,
  VERIFY_LDIVERSITY,
];

module.exports = GRAASP_ALGORITHMS;
