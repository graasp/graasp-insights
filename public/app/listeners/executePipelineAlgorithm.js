const path = require('path');
const logger = require('../logger');

const { DATASETS_FOLDER } = require('../config/paths');
const {
  EXECUTE_PIPELINE_CHANNEL,
  buildExecutePipelineChannel,
} = require('../../shared/channels');
const {
  EXECUTE_ALGORITHM_ERROR,
  EXECUTE_PIPELINE_SUCCESS,
  EXECUTE_ALGORITHM_SUCCESS,
  CREATE_EXECUTION_SUCCESS,
} = require('../../shared/types');
const {
  PROGRAMMING_LANGUAGES,
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
  EXECUTIONS_COLLECTION,
  EXECUTION_STATUSES,
} = require('../../shared/constants');
const {
  ALGORITHM_DATASET_PATH_NAME,
  ALGORITHM_OUTPUT_PATH_NAME,
} = require('../config/config');
const { ERROR_UNKNOWN_PROGRAMMING_LANGUAGE } = require('../../shared/errors');

const { createExecutionInDb } = require('./createExecution');
const executePythonAlgorithm = require('./executePythonAlgorithm');
const createNewResultDataset = require('../utils/result');
const {
  buildOnRunCallback,
  buildOnStopCallback,
  buildOnErrorCallback,
  buildCleanCallback,
  buildOnLogCallback,
  buildFilepathParameter,
} = require('../utils/execution');

const runAlgorithm = (
  mainWindow,
  channel,
  {
    execution,
    language,
    algorithmFilepath,
    filepath,
    tmpPath,
    parameters,
    schemaId,
    onRun,
    onStop,
    onSuccess,
    onError,
    clean,
    onLog,
  },
) => {
  switch (language) {
    case PROGRAMMING_LANGUAGES.PYTHON: {
      // include paths

      // path to the dataset
      const datasetPathParameter = buildFilepathParameter(
        ALGORITHM_DATASET_PATH_NAME,
        filepath,
      );

      // destination path
      // indicates where the algorithm should save the resulting dataset
      const outputPathParameter = buildFilepathParameter(
        ALGORITHM_OUTPUT_PATH_NAME,
        tmpPath,
      );

      const fullParameters = [
        datasetPathParameter,
        outputPathParameter,
        ...parameters,
      ];
      return executePythonAlgorithm(
        { algorithmFilepath, parameters: fullParameters, schemaId },
        { onRun, onStop, onSuccess, onError, clean, onLog },
      );
    }
    default:
      // check whether mainWindow still exist in case of
      // the app quits before the process get killed
      // eslint-disable-next-line no-unused-expressions
      !mainWindow.isDestroyed() &&
        mainWindow.webContents.send(channel, {
          type: EXECUTE_ALGORITHM_ERROR,
          error: ERROR_UNKNOWN_PROGRAMMING_LANGUAGE,
          payload: { execution },
        });
      throw new Error(ERROR_UNKNOWN_PROGRAMMING_LANGUAGE);
  }
};

const executePipelineAlgorithm = (
  mainWindow,
  db,
  {
    pipelineExecutionId,
    algorithms,
    sourceId,
    userProvidedFilename,
    schemaId,
    algorithmIndex,
  },
) => {
  const pipelineChannel = buildExecutePipelineChannel(pipelineExecutionId);

  const algorithm = algorithms[algorithmIndex];
  // provide either the transient or final filename
  const newProvidedFileName =
    algorithmIndex + 1 === algorithms.length
      ? userProvidedFilename
      : `${userProvidedFilename}_${algorithmIndex}_${algorithm.id}`;

  const execution = createExecutionInDb(db, {
    pipelineExecutionId,
    sourceId,
    algorithmId: algorithm.id,
    userProvidedFilename: newProvidedFileName,
    parameters:
      db
        .get(ALGORITHMS_COLLECTION)
        .find(({ id }) => id === algorithm.id)
        .value()?.parameters || [],
    schemaId,
  });

  // eslint-disable-next-line no-unused-expressions
  mainWindow?.webContents?.send(pipelineChannel, {
    type: CREATE_EXECUTION_SUCCESS,
    payload: execution,
  });

  const { description, filepath } = db
    .get(DATASETS_COLLECTION)
    .find({ id: sourceId })
    .value();
  const { filepath: algorithmFilepath, language } = db
    .get(ALGORITHMS_COLLECTION)
    .find({ id: algorithm.id })
    .value();
  const tmpPath = path.join(DATASETS_FOLDER, `tmp_${execution.id}.json`);

  // prepare all callback functions
  const onRun = buildOnRunCallback(mainWindow, db, pipelineChannel, {
    executionId: execution.id,
  });

  // the onSuccess callback allows to run the next algorithm of the pipeline
  const onSuccess = ({ log }) => {
    // save result in db
    const newResult = createNewResultDataset(db, {
      name: execution.result.name,
      filepath: tmpPath,
      algorithmId: algorithm.id,
      description,
    });

    db.get(EXECUTIONS_COLLECTION)
      .find({ id: execution.id })
      .assign({
        status: EXECUTION_STATUSES.SUCCESS,
        result: { id: newResult.id },
        log,
      })
      .unset('pid')
      .write();

    logger.debug(`save resulting dataset at ${newResult.filepath}`);

    // eslint-disable-next-line no-unused-expressions
    mainWindow?.webContents?.send(pipelineChannel, {
      type: EXECUTE_ALGORITHM_SUCCESS,
      payload: {
        execution: db
          .get(EXECUTIONS_COLLECTION)
          .find({ id: execution.id })
          .value(),
        result: newResult,
      },
    });

    // continue running the pipeline by executing the next algorithm
    if (algorithmIndex + 1 < algorithms.length) {
      return executePipelineAlgorithm(mainWindow, db, {
        pipelineExecutionId,
        algorithms,
        sourceId: newResult.id,
        userProvidedFilename,
        schemaId,
        algorithmIndex: algorithmIndex + 1,
      });
    }
    // the whole pipeline is executed so we can return
    return mainWindow.webContents.send(EXECUTE_PIPELINE_CHANNEL, {
      type: EXECUTE_PIPELINE_SUCCESS,
      payload: {
        execution: db
          .get(EXECUTIONS_COLLECTION)
          .find({ id: execution.id })
          .value(),
      },
    });
  };

  const clean = buildCleanCallback(tmpPath);
  const onStop = buildOnStopCallback(mainWindow, db, pipelineChannel, {
    executionId: execution.id,
  });
  const onError = buildOnErrorCallback(mainWindow, db, pipelineChannel, {
    executionId: execution.id,
  });
  const onLog = buildOnLogCallback(mainWindow, db, pipelineChannel, {
    executionId: execution.id,
  });

  runAlgorithm(mainWindow, pipelineChannel, {
    execution,
    language,
    algorithmFilepath,
    filepath,
    tmpPath,
    parameters: execution.parameters,
    schemaId,
    onRun,
    onStop,
    onSuccess,
    onError,
    clean,
    onLog,
  });
};

module.exports = executePipelineAlgorithm;
