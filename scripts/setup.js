const fs = require('fs');
const path = require('path');
const { FILE_ENCODINGS } = require('../public/shared/constants');

const DEFAULT_PATH = './public/';
const NAME = 'env.json';

const {
  SENTRY_DSN = '',
  GOOGLE_API_KEY = '',
  GOOGLE_ANALYTICS_ID = '',
  LOGGING_LEVEL = 'info',
} = process.env;

const env = JSON.stringify({
  SENTRY_DSN,
  GOOGLE_API_KEY,
  GOOGLE_ANALYTICS_ID,
  LOGGING_LEVEL,
});

fs.writeFileSync(path.join(DEFAULT_PATH, NAME), env, {
  encoding: FILE_ENCODINGS.UTF8,
});
