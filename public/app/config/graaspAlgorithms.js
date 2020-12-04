const { PROGRAMMING_LANGUAGES, AUTHORS } = require('../../shared/constants');
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
  },
  {
    id: 'suppress-geolocation',
    name: 'Suppress geolocation',
    description: "Suppress the 'geolocation' field from the 'actions'",
    filename: 'suppress_geolocation.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'suppress-data',
    name: 'Suppress data',
    description: "Suppress the 'data' field from the 'actions'",
    filename: 'suppress_data.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'suppress-users',
    name: 'Suppress users',
    description: "Suppress the 'users' field from a dataset",
    filename: 'suppress_users.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'suppress-app-instances-settings',
    name: 'Suppress appInstances settings',
    description: "Suppress the 'settings' field from the 'appInstances'",
    filename: 'suppress_appInstances_settings.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'suppress-app-instances-resources-data',
    name: 'Suppress appInstancesResources data',
    description: "Suppress the 'data' field from the 'appInstanceResource'",
    filename: 'suppress_appInstanceResources_data.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
  {
    id: 'two-anonymize-geolocation',
    name: '2-Anonymize geolocation',
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least two users containing that combination.
        The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    filename: 'two_anonymize_geolocations.py',
    author: AUTHORS.GRAASP,
    language: PROGRAMMING_LANGUAGES.PYTHON,
    type: ALGORITHM_TYPES.ANONYMIZATION,
  },
];

module.exports = GRAASP_ALGORITHMS;
