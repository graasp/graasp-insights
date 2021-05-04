const { PIPELINES_COLLECTION } = require('../../../src/shared/constants');
const {
  ALGORITHM_TYPES,
  ALGORITHMS_COLLECTION,
} = require('../../shared/constants');

// todo: merge pipeline and algorithm?
const getAlgorithmOrPipelineById = (id, db) => {
  const algo = db.get(ALGORITHMS_COLLECTION).find({ id }).value();

  if (algo) {
    return algo;
  }

  const pipeline = db.get(PIPELINES_COLLECTION).find({ id }).value();

  if (pipeline) {
    return { ...pipeline, type: ALGORITHM_TYPES.PIPELINE };
  }

  throw new Error(`${id} is not an algorithm nor a pipeline`);
};

module.exports = { getAlgorithmOrPipelineById };
