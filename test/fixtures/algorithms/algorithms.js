import { PROGRAMMING_LANGUAGES } from '../../../src/config/constants';

const DEFAULT_AUTHOR = 'Graasp';

// eslint-disable-next-line import/prefer-default-export
export const GRAASP_ALGORITHMS = [
  {
    name: 'Hash users',
    description:
      "Hash the userId field from the 'actions' and 'appInstanceResources'",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Sanitize users',
    description:
      'Scan the dataset for occurrences of user names and user IDs, and replace such occurrences with a hash of the corresponding user ID',
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Suppress geolocation',
    description: "Suppress the 'geolocation' field from the 'actions'",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Suppress data',
    description: "Suppress the 'data' field from the 'actions'",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Suppress users',
    description: "Suppress the 'users' field from a dataset",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Suppress appInstances settings',
    description: "Suppress the 'settings' field from the 'appInstances'",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: 'Suppress appInstancesResources data',
    description: "Suppress the 'data' field from the 'appInstanceResource'",
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
  {
    name: '2-Anonymize geolocation',
    description: `Ensure that for every combination of 'country', 'region', and 'city', there are at least two users containing that combination.
        The corresponding fields are suppressed (from 'city' to 'country') when necessary`,
    author: DEFAULT_AUTHOR,
    language: PROGRAMMING_LANGUAGES.PYTHON,
  },
];
