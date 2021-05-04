const { DATASET_TYPES } = require('../../shared/constants');
const {
  DATASETS_COLLECTION,
  ALGORITHMS_COLLECTION,
} = require('../../shared/constants');
const { createNewDataset } = require('../listeners/loadDataset');

const createNewResultDataset = (
  db,
  { name, filepath, algorithmId, description, originId },
) => {
  let resultName = name;
  if (!name) {
    const { name: sourceName } = db
      .get(DATASETS_COLLECTION)
      .find({ id: originId })
      .value();
    const { name: algorithmName } = db
      .get(ALGORITHMS_COLLECTION)
      .find({ id: algorithmId })
      .value();

    resultName = `${sourceName}_${algorithmName}`;
  }

  const datasetInfo = createNewDataset(
    {
      name: resultName,
      filepath,
      description,
      type: DATASET_TYPES.RESULT,
    },
    db,
  );

  const result = { ...datasetInfo, algorithmId, originId };
  db.get(DATASETS_COLLECTION).push(result).write();

  return result;
};

module.exports = createNewResultDataset;
