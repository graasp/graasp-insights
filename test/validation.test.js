import { expect } from 'chai';
import {
  ADD_VALIDATION_ADD_ALGORITHM_BUTTON_ID,
  ADD_VALIDATION_ALGORITHMS_SELECT_ID,
  ADD_VALIDATION_DATASETS_SELECT_ID,
  ADD_VALIDATION_EXECUTE_BUTTON_ID,
  ALGORITHM_NAME_CLASS,
  buildAddValidationAlgorithmOptionId,
  buildAddValidationDatasetOptionId,
  buildValidationRowClass,
  DATASET_NAME_CLASS,
  VALIDATION_ADD_BUTTON_ID,
  VALIDATION_DELETE_BUTTON_CLASS,
  VALIDATION_EXECUTION_RESULT_CLASS,
  VALIDATION_TABLE_ID,
} from '../src/config/selectors';
import { closeApplication, createApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  PREEXISTING_VALIDATION_ALGORITHM,
  VALIDATION_ALGORITHM_FAILURE,
  VALIDATION_ALGORITHM_SUCCESS,
  VALIDATION_ALGORITHM_WARNING,
} from './fixtures/algorithms/algorithms';
import { SIMPLE_DATASET } from './fixtures/datasets/datasets';
import {
  PREEXISTING_VALIDATION_EXECUTION,
  VALIDATION_EXECUTION_SUCCESS,
  VALIDATION_EXECUTION_WARNING,
  VALIDATION_EXECUTION_FAILURE,
  PREEXISTING_VALIDATION,
  VALIDATION_SUCCESS,
  VALIDATION_WARNING,
  VALIDATION_FAILURE,
  VALIDATION_MULTIPLE_ALGORITHMS,
} from './fixtures/validation/validation';
import { mochaAsync } from './utils';

const getNumberOfValidations = async (client) => {
  return (await client.$$(`#${VALIDATION_TABLE_ID} .${DATASET_NAME_CLASS}`))
    .length;
};

const checkValidationRowLayout = async (client, validation) => {
  const { executions, datasetName } = validation;

  const algorithmNames = executions.map(({ algorithmName }) => algorithmName);

  const matchedValidation = await client.$(
    `#${VALIDATION_TABLE_ID} .${buildValidationRowClass(
      datasetName,
      algorithmNames,
    )}`,
  );

  expect(
    await (await matchedValidation.$(`.${DATASET_NAME_CLASS}`)).getText(),
  ).to.equal(datasetName);

  const validationExecutionResults = await matchedValidation.$$(
    `.${VALIDATION_EXECUTION_RESULT_CLASS}`,
  );
  expect(validationExecutionResults.length).to.equal(executions.length);

  await Promise.all(
    executions.map(async ({ result: { outcome }, algorithmName }, idx) => {
      const executionResult = validationExecutionResults[idx];

      expect(
        await (await executionResult.$(`.${ALGORITHM_NAME_CLASS}`)).getText(),
      ).to.equal(algorithmName);

      const status = await executionResult.$(`.${outcome}`);
      const found = await status.isExisting();
      expect(found).to.be.true;
    }),
  );
};

const addValidation = async (client, validation) => {
  const addButton = await client.$(`#${VALIDATION_ADD_BUTTON_ID}`);
  await addButton.click();

  const {
    source: { id: datasetId },
    executions,
  } = validation;

  const datasetSelect = await client.$(`#${ADD_VALIDATION_DATASETS_SELECT_ID}`);
  await datasetSelect.click();

  const datasetOptionId = buildAddValidationDatasetOptionId(datasetId);
  const datasetOptionEl = await client.$(`#${datasetOptionId}`);
  await datasetOptionEl.click();

  const algorithmSelect = await client.$(
    `#${ADD_VALIDATION_ALGORITHMS_SELECT_ID}`,
  );
  const addAlgorithmButton = await client.$(
    `#${ADD_VALIDATION_ADD_ALGORITHM_BUTTON_ID}`,
  );

  // add validation algorithms sequentially
  await executions.reduce((p, { algorithmId }) => {
    return p.then(async () => {
      await algorithmSelect.click();
      const algorithmOptionId = buildAddValidationAlgorithmOptionId(
        algorithmId,
      );
      const algorithmOptionEl = await client.$(`#${algorithmOptionId}`);
      await algorithmOptionEl.click();
      await addAlgorithmButton.click();
    });
  }, Promise.resolve());

  const addValidationButton = await client.$(
    `#${ADD_VALIDATION_EXECUTE_BUTTON_ID}`,
  );
  await addValidationButton.click();
};

const deleteValidation = async (client, validation) => {
  const { executions, datasetName } = validation;

  const algorithmNames = executions.map(({ algorithmName }) => algorithmName);

  const matchedValidation = await client.$(
    `#${VALIDATION_TABLE_ID} .${buildValidationRowClass(
      datasetName,
      algorithmNames,
    )}`,
  );

  const deleteButton = await matchedValidation.$(
    `.${VALIDATION_DELETE_BUTTON_CLASS}`,
  );
  await deleteButton.click();
};

describe('Validation Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          datasets: [SIMPLE_DATASET],
          algorithms: [
            PREEXISTING_VALIDATION_ALGORITHM,
            VALIDATION_ALGORITHM_SUCCESS,
            VALIDATION_ALGORITHM_WARNING,
            VALIDATION_ALGORITHM_FAILURE,
          ],
          executions: [
            PREEXISTING_VALIDATION_EXECUTION,
            VALIDATION_EXECUTION_SUCCESS,
            VALIDATION_EXECUTION_WARNING,
            VALIDATION_EXECUTION_FAILURE,
          ],
          validations: [PREEXISTING_VALIDATION],
        },
        responses: { showMessageDialogResponse: 1 },
      });
      const { client } = app;
      await client.goToValidation();
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Correctly displays the validations',
    mochaAsync(async () => {
      const { client } = app;

      await checkValidationRowLayout(client, PREEXISTING_VALIDATION);
    }),
  );

  it(
    'Execute validation algorithm with success',
    mochaAsync(async () => {
      const { client } = app;

      const nValidationsPrior = await getNumberOfValidations(client);

      await addValidation(client, VALIDATION_SUCCESS);
      await checkValidationRowLayout(client, VALIDATION_SUCCESS);

      const nValidationsAfter = await getNumberOfValidations(client);
      expect(nValidationsAfter - nValidationsPrior).to.be.equal(1);
    }),
  );

  it(
    'Execute validation algorithm with warning',
    mochaAsync(async () => {
      const { client } = app;

      const nValidationsPrior = await getNumberOfValidations(client);

      await addValidation(client, VALIDATION_WARNING);
      await checkValidationRowLayout(client, VALIDATION_WARNING);

      const nValidationsAfter = await getNumberOfValidations(client);
      expect(nValidationsAfter - nValidationsPrior).to.be.equal(1);
    }),
  );

  it(
    'Execute validation algorithm with failure',
    mochaAsync(async () => {
      const { client } = app;

      const nValidationsPrior = await getNumberOfValidations(client);

      await addValidation(client, VALIDATION_FAILURE);
      await checkValidationRowLayout(client, VALIDATION_FAILURE);

      const nValidationsAfter = await getNumberOfValidations(client);
      expect(nValidationsAfter - nValidationsPrior).to.be.equal(1);
    }),
  );

  it(
    'Execute multiple validation algorithms',
    mochaAsync(async () => {
      const { client } = app;

      const nValidationsPrior = await getNumberOfValidations(client);

      await addValidation(client, VALIDATION_MULTIPLE_ALGORITHMS);
      await checkValidationRowLayout(client, VALIDATION_MULTIPLE_ALGORITHMS);

      const nValidationsAfter = await getNumberOfValidations(client);
      expect(nValidationsAfter - nValidationsPrior).to.be.equal(1);
    }),
  );

  it(
    'Add and delete validation',
    mochaAsync(async () => {
      const { client } = app;

      const nValidationsPrior = await getNumberOfValidations(client);

      await addValidation(client, VALIDATION_SUCCESS);
      await checkValidationRowLayout(client, VALIDATION_SUCCESS);

      const nValidationsAfter = await getNumberOfValidations(client);
      expect(nValidationsAfter - nValidationsPrior).to.be.equal(1);

      await deleteValidation(client, VALIDATION_SUCCESS);

      const nValidationsEnd = await getNumberOfValidations(client);
      expect(nValidationsEnd).to.be.equal(nValidationsPrior);
    }),
  );
});
