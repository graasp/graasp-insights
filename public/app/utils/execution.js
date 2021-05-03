const fs = require('fs');
const logger = require('../logger');
const {
  EXECUTIONS_COLLECTION,
  EXECUTION_STATUSES,
} = require('../../shared/constants');
const {
  EXECUTE_ALGORITHM_STOP,
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_ALGORITHM_UPDATE,
} = require('../../shared/types');
const { ERROR_EXECUTION_PROCESS } = require('../../shared/errors');

const { cancelExecutionInDb } = require('../listeners/cancelExecution');

const buildOnRunCallback = (mainWindow, db, channel, { executionId }) => {
  // set execution as running and pid
  return ({ pid }) => {
    const execution = db
      .get(EXECUTIONS_COLLECTION)
      .find({ id: executionId })
      .assign({ status: EXECUTION_STATUSES.RUNNING, pid })
      .write();

    return mainWindow?.webContents?.send(channel, {
      type: EXECUTE_ALGORITHM_UPDATE,
      payload: {
        execution,
      },
    });
  };
};

const buildOnStopCallback = (mainWindow, db, channel, { executionId }) => {
  return () => {
    cancelExecutionInDb(db, executionId);

    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    return (
      !mainWindow.isDestroyed() &&
      mainWindow?.webContents?.send(channel, {
        type: EXECUTE_ALGORITHM_STOP,
      })
    );
  };
};

const buildCleanCallback = (tmpPath) => {
  // clean the tmp file at the end of the execution
  return () => {
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  };
};

const buildOnErrorCallback = (mainWindow, db, channel, { executionId }) => {
  // error handling when executing
  return ({ code, log }) => {
    logger.error(
      `process for execution ${executionId} exited with code ${code}`,
    );
    db.get(EXECUTIONS_COLLECTION)
      .find({ id: executionId })
      .assign({ status: EXECUTION_STATUSES.ERROR, log })
      .unset('pid')
      .value();

    // check whether mainWindow still exist in case of
    // the app quits before the process get killed
    return (
      !mainWindow.isDestroyed() &&
      mainWindow?.webContents?.send(channel, {
        type: EXECUTE_ALGORITHM_ERROR,
        error: ERROR_EXECUTION_PROCESS,
        payload: {
          execution: db
            .get(EXECUTIONS_COLLECTION)
            .find({ id: executionId })
            .value(),
        },
      })
    );
  };
};

const buildOnLogCallback = (mainWindow, db, channel, { executionId }) => ({
  log,
}) => {
  const execution = db
    .get(EXECUTIONS_COLLECTION)
    .find({ id: executionId })
    .assign({ log })
    .write();

  // check whether mainWindow still exist in case of
  // the app quits before the process get killed
  return (
    !mainWindow.isDestroyed() &&
    mainWindow?.webContents?.send(channel, {
      type: EXECUTE_ALGORITHM_UPDATE,
      payload: {
        execution,
      },
    })
  );
};

module.exports = {
  buildOnRunCallback,
  buildOnStopCallback,
  buildOnErrorCallback,
  buildCleanCallback,
  buildOnLogCallback,
};
