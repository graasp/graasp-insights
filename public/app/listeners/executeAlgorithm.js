const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const { RESULTS_FOLDER } = require('../config/config');
const { createNewDataset } = require('./loadDataset');
const {
  DATASETS_COLLECTION,
  RESULTS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
} = require('../db');
const { EXECUTE_ALGORITHM_CHANNEL } = require('../../shared/channels');
const {
  PROGRAMMING_LANGUAGES,
  EXECUTION_STATUSES,
} = require('../config/config');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const {
  UNKNOWN_PROGRAMMING_LANGUAGE,
  ERROR_EXECUTION_PROCESS,
  ERROR_GENERAL,
} = require('../../shared/errors');
const {
  EXECUTE_ALGORITHM_SUCCESS,
  EXECUTE_ALGORITHM_ERROR,
} = require('../../shared/types');

const createNewResultDataset = ({
  name,
  filepath,
  algorithmId,
  description,
}) => {
  const result = createNewDataset({
    name,
    filepath,
    folderPath: RESULTS_FOLDER,
    description,
  });
  result.algorithmId = algorithmId;
  return result;
};

const executeAlgorithm = (mainWindow, db) => (
  event,
  { datasetId, algorithmId, id: executionId },
) => {
  const channel = `${EXECUTE_ALGORITHM_CHANNEL}_${executionId}`;
  try {
    // set execution as running
    db.get(EXECUTIONS_COLLECTION)
      .find({ id: executionId })
      .assign({ status: EXECUTION_STATUSES.RUNNING })
      .write();

    // get corresponding dataset
    const { filepath, name: datasetName, description } = db
      .get(DATASETS_COLLECTION)
      .find({ id: datasetId })
      .value();

    // get the corresponding algorithm
    const {
      filepath: algorithmFilepath,
      name: algorithmName,
      language,
    } = db.get(ALGORITHMS_COLLECTION).find({ id: algorithmId }).value();

    const tmpPath = path.join(RESULTS_FOLDER, `tmp_${executionId}.json`);

    // prepare success callback function
    // copy tmp as new result dataset
    // update execution and return it
    const onSuccess = () => {
      // save result in db
      const newResult = createNewResultDataset({
        name: `${datasetName}_${algorithmName}`,
        filepath: tmpPath,
        algorithmId,
        description,
      });
      db.get(RESULTS_COLLECTION).push(newResult).write();

      const finalExecution = db
        .get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({ resultId: newResult.id, status: EXECUTION_STATUSES.SUCCESS })
        .write();

      logger.debug(`save resulting dataset at ${newResult.filepath}`);

      mainWindow.webContents.send(channel, {
        type: EXECUTE_ALGORITHM_SUCCESS,
        payload: { execution: finalExecution, result: newResult },
      });
    };

    // clean the tmp file at the end of the execution
    const clean = () => {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    };

    // error handling when executing
    const onError = (code) => {
      logger.error(
        `process for execution ${executionId} exited with code ${code}`,
      );
      db.get(EXECUTIONS_COLLECTION)
        .find({ id: executionId })
        .assign({ status: EXECUTION_STATUSES.ERROR })
        .value();
      mainWindow.webContents.send(channel, {
        type: EXECUTE_ALGORITHM_ERROR,
        error: ERROR_EXECUTION_PROCESS,
      });
    };

    switch (language) {
      case PROGRAMMING_LANGUAGES.PYTHON:
        return executePythonAlgorithm(
          { algorithmFilepath, filepath, tmpPath },
          onSuccess,
          onError,
          clean,
        );

      default:
        return mainWindow.webContents.send(channel, {
          type: EXECUTE_ALGORITHM_ERROR,
          error: UNKNOWN_PROGRAMMING_LANGUAGE,
        });
    }
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(channel, {
      type: EXECUTE_ALGORITHM_ERROR,
      error: ERROR_GENERAL,
    });
  }
};

module.exports = executeAlgorithm;
