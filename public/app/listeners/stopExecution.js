const { EXECUTIONS_COLLECTION } = require('../db');
const logger = require('../logger');
const { EXECUTION_STATUSES } = require('../config/config');

const stopExecution = (db, { id }) => {
  logger.debug('stop execution with id ', id);
  db.get(EXECUTIONS_COLLECTION)
    .find({ id })
    .assign({ status: EXECUTION_STATUSES.ERROR })
    .write();

  // todo: stop associated process
};

const stopAllRunningExecutions = async (db) => {
  const runningExecutions = db
    .get(EXECUTIONS_COLLECTION)
    .filter({ status: EXECUTION_STATUSES.RUNNING })
    .value();
  // eslint-disable-next-line no-restricted-syntax
  for (const execution of runningExecutions) {
    // eslint-disable-next-line no-await-in-loop
    await stopExecution(db, execution);
  }
};

module.exports = { stopExecution, stopAllRunningExecutions };
