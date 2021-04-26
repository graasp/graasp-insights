const {
  VALIDATION_STATUSES: { SUCCESS, WARNING, FAILURE },
} = require('../../shared/constants');

const parseValidationResult = (log) => {
  const regex = new RegExp(
    `{.*"outcome":\\s*"(${SUCCESS}|${WARNING}|${FAILURE})".*}`,
    'm',
  );
  return log.match(regex)?.[0];
};

module.exports = { parseValidationResult };
