const { DATASET_TYPES } = require('../../shared/constants');

const { createNewDataset } = require('../listeners/loadDataset');

const createNewResultDataset = (
  { name, filepath, algorithmId, description, originId },
  db,
) => {
  const result = createNewDataset(
    {
      name,
      filepath,
      description,
      type: DATASET_TYPES.RESULT,
    },
    db,
  );
  return { ...result, algorithmId, originId };
};

module.exports = createNewResultDataset;
