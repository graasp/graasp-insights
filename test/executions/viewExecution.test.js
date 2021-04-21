import { expect } from 'chai';
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  buildExecutionViewButtonId,
  buildParameterId,
  EXECUTION_VIEW_LOG_ID,
  EXECUTION_VIEW_TABLE_ID,
} from '../../src/config/selectors';
import {
  EXECUTION_SLOW_ERROR,
  EXECUTION_FAST,
  EXECUTION_FAST_ERROR,
  EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER,
} from '../fixtures/executions/executions';
import { EXECUTION_STATUSES } from '../../src/shared/constants';
import { createExecution } from './utils';

const checkExecutionViewPageLayout = async (
  client,
  { parameters = [], dataset, algorithm },
) => {
  // info
  const table = await client.$(`#${EXECUTION_VIEW_TABLE_ID}`);
  const tableText = await table.getText();
  expect(tableText).to.contain(dataset.name);
  expect(tableText).to.contain(algorithm.name);

  // parameters
  for (const { name, value } of parameters) {
    const paramEl = await client.$(`#${buildParameterId(name)}`);
    const paramText = await paramEl.getValue();
    expect(paramText).to.contain(value);
  }

  // log
  const logEl = await (await client.$(`#${EXECUTION_VIEW_LOG_ID}`)).getText();
  expect(logEl).to.not.be.empty;
};

describe('View Execution Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  before(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          datasets: [
            EXECUTION_FAST.dataset,
            EXECUTION_FAST_ERROR.dataset,
            EXECUTION_SLOW_ERROR.dataset,
            EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER.dataset,
          ],
          algorithms: [
            EXECUTION_FAST.algorithm,
            EXECUTION_FAST_ERROR.algorithm,
            EXECUTION_SLOW_ERROR.algorithm,
            EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER.algorithm,
          ],
        },
      });
    }),
  );

  after(() => {
    return closeApplication(app);
  });

  it(
    'Successful execution',
    mochaAsync(async () => {
      const { client } = app;
      await client.goToExecutions();

      await createExecution(client, EXECUTION_FAST);
      const {
        dataset: { id: datasetId },
        algorithm: { id: algoId },
      } = EXECUTION_FAST;

      await (
        await client.$(`#${buildExecutionViewButtonId(datasetId, algoId)}`)
      ).click();
      await checkExecutionViewPageLayout(client, EXECUTION_FAST);
      await client.pause(1000);
      await client.expectElementToExist(`.${EXECUTION_STATUSES.SUCCESS}`);
    }),
  );

  it(
    'Successful execution with parameter',
    mochaAsync(async () => {
      const { client } = app;
      await client.goToExecutions();

      await createExecution(
        client,
        EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER,
      );
      const {
        dataset: { id: datasetId },
        algorithm: { id: algoId },
      } = EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER;

      await (
        await client.$(`#${buildExecutionViewButtonId(datasetId, algoId)}`)
      ).click();
      await checkExecutionViewPageLayout(
        client,
        EXECUTION_WITH_SUCCESSFUL_INTEGER_PARAMETER,
      );
      await client.pause(1000);
      await client.expectElementToExist(`.${EXECUTION_STATUSES.SUCCESS}`);
    }),
  );

  it(
    'Error execution',
    mochaAsync(async () => {
      const { client } = app;
      await client.goToExecutions();

      await createExecution(client, EXECUTION_FAST_ERROR);
      const {
        dataset: { id: datasetId },
        algorithm: { id: algoId },
      } = EXECUTION_FAST_ERROR;

      await (
        await client.$(`#${buildExecutionViewButtonId(datasetId, algoId)}`)
      ).click();
      await checkExecutionViewPageLayout(client, EXECUTION_FAST_ERROR);
      await client.pause(1000);
      await client.expectElementToExist(`.${EXECUTION_STATUSES.ERROR}`);
    }),
  );

  it(
    'Fetch execution information when long',
    mochaAsync(async () => {
      const { client } = app;
      await client.goToExecutions();

      await createExecution(client, EXECUTION_SLOW_ERROR);
      const {
        dataset: { id: datasetId },
        algorithm: { id: algoId },
      } = EXECUTION_SLOW_ERROR;

      await (
        await client.$(`#${buildExecutionViewButtonId(datasetId, algoId)}`)
      ).click();
      await checkExecutionViewPageLayout(client, EXECUTION_SLOW_ERROR);
      await client.pause(11000);
      await client.expectElementToExist(`.${EXECUTION_STATUSES.ERROR}`);
    }),
  );
});
