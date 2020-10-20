/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  buildExecutionAlgorithmOptionId,
  buildExecutionDatasetOptionId,
  EXECUTIONS_ALERT_NO_DATASET_ID,
  EXECUTIONS_ALGORITHMS_SELECT_ID,
  EXECUTIONS_DATASETS_SELECT_ID,
  EXECUTIONS_EXECUTE_BUTTON_ID,
  EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS,
  EXECUTIONS_MAIN_ID,
  EXECUTIONS_TABLE_ID,
  RESULTS_MAIN_ID,
} from '../../src/config/selectors';
import {
  EXECUTION_FAST,
  EXECUTION_FAST_ERROR,
  EXECUTION_SLOW_ERROR,
  EXECUTION_SLOW,
} from '../fixtures/executions/executions';
import { EXECUTION_STATUSES } from '../../src/shared/constants';

const createExecution = async (client, { dataset, algorithm }) => {
  const datasetSelect = await client.$(`#${EXECUTIONS_DATASETS_SELECT_ID}`);
  await datasetSelect.click();
  await (
    await client.$(`#${buildExecutionDatasetOptionId(dataset.id)}`)
  ).click();
  const algorithmSelect = await client.$(`#${EXECUTIONS_ALGORITHMS_SELECT_ID}`);
  await algorithmSelect.click();
  await (
    await client.$(`#${buildExecutionAlgorithmOptionId(algorithm.id)}`)
  ).click();

  // todo: as save

  await (await client.$(`#${EXECUTIONS_EXECUTE_BUTTON_ID}`)).click();
};

const checkExecutionRowLayout = async (
  client,
  { dataset, algorithm, name, status, rowIdx },
) => {
  const trs = await client.$$(`#${EXECUTIONS_TABLE_ID} tr`);
  const tr = trs[trs.length - rowIdx - 1]; // more recent is first, skip header

  const executionName = name || `${dataset.name}_${algorithm.name}`;

  // todo: check more precisely
  const html = await tr.getHTML();
  expect(html).to.contain(dataset.name);
  expect(html).to.contain(algorithm.name);
  if (status === EXECUTION_STATUSES.SUCCESS) {
    expect(html).to.contain(executionName);
  }
  expect(html).to.contain(status);
};

const checkExecutionTableLayout = async (client, executions) => {
  for (const [idx, execution] of executions.entries()) {
    await checkExecutionRowLayout(client, {
      ...execution,
      rowIdx: idx,
    });
  }
};

const checkResultRowLayout = async (
  client,
  { name, algorithm, dataset, rowIdx },
) => {
  const tr = (await client.$$(`#${RESULTS_MAIN_ID} tr`))[rowIdx + 1]; // +1 to skip header
  const executionName = name || `${dataset.name}_${algorithm.name}`;

  // todo: check more precisely
  const html = await tr.getHTML();
  expect(html).to.contain(executionName);
  expect(html).to.contain(algorithm.name);
};

const deleteExecution = async (client, { rowIdx }) => {
  const trs = await client.$$(`#${EXECUTIONS_TABLE_ID} tr`);
  const tr = trs[trs.length - rowIdx - 1]; // more recent is first, skip header

  await (await tr.$(`.${EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS}`)).click();
};

describe('Executions Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('Default Layout', () => {
    it(
      'No dataset',
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        await client.goToExecutions();
        await client.expectElementToExist(`#${EXECUTIONS_ALERT_NO_DATASET_ID}`);
      }),
    );
    it(
      'Contains datasets and algorithms',
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            datasets: [EXECUTION_FAST.dataset],
          },
        });
        const { client } = app;
        await client.goToExecutions();
        await client.expectElementToExist(`#${EXECUTIONS_DATASETS_SELECT_ID}`);
        await client.expectElementToExist(
          `#${EXECUTIONS_ALGORITHMS_SELECT_ID}`,
        );
        await client.expectElementToExist(`#${EXECUTIONS_EXECUTE_BUTTON_ID}`);
        await client.expectElementToNotExist(
          `#${EXECUTIONS_MAIN_ID}`,
          EXECUTIONS_TABLE_ID,
        );
      }),
    );
  });

  describe('Executions create Results', () => {
    describe('Successful executions', () => {
      beforeEach(
        mochaAsync(async () => {
          app = await createApplication({
            database: {
              datasets: [EXECUTION_FAST.dataset, EXECUTION_SLOW.dataset],
              algorithms: [EXECUTION_FAST.algorithm, EXECUTION_SLOW.algorithm],
            },
          });
          await app.client.goToExecutions();
        }),
      );

      it(
        'Execute fast algorithm and slow algorithm',
        mochaAsync(async () => {
          const { client } = app;

          // fast
          await createExecution(client, EXECUTION_FAST);
          await client.pause(1000);
          await checkExecutionRowLayout(client, {
            ...EXECUTION_FAST,
            status: EXECUTION_STATUSES.SUCCESS,

            rowIdx: 0,
          });
          await client.goToResults();
          await checkResultRowLayout(client, {
            ...EXECUTION_FAST,
            rowIdx: 0,
          });

          await client.goToExecutions();

          // slow
          await createExecution(client, EXECUTION_SLOW);

          // status should be running
          await checkExecutionRowLayout(client, {
            ...EXECUTION_SLOW,
            status: EXECUTION_STATUSES.RUNNING,
            rowIdx: 1,
          });
          await client.pause(6000);
          // status should be success
          await checkExecutionRowLayout(client, {
            ...EXECUTION_SLOW,
            status: EXECUTION_STATUSES.SUCCESS,
            rowIdx: 1,
          });
          await client.goToResults();
          await checkResultRowLayout(client, {
            ...EXECUTION_SLOW,
            rowIdx: 1,
          });
        }),
      );
    });
    describe('Failing executions', () => {
      beforeEach(
        mochaAsync(async () => {
          app = await createApplication({
            database: {
              datasets: [
                EXECUTION_FAST_ERROR.dataset,
                EXECUTION_SLOW_ERROR.dataset,
              ],
              algorithms: [
                EXECUTION_FAST_ERROR.algorithm,
                EXECUTION_SLOW_ERROR.algorithm,
              ],
            },
          });
          await app.client.goToExecutions();
        }),
      );

      it(
        'Execute fast and slow algorithm with error',
        mochaAsync(async () => {
          const { client } = app;

          // fast
          await createExecution(client, EXECUTION_FAST_ERROR);
          await client.pause(1000);
          await checkExecutionRowLayout(client, {
            ...EXECUTION_FAST_ERROR,
            status: EXECUTION_STATUSES.ERROR,
            rowIdx: 0,
          });

          // slow

          await createExecution(client, EXECUTION_SLOW_ERROR);

          // status should be running
          await checkExecutionRowLayout(client, {
            ...EXECUTION_SLOW_ERROR,
            status: EXECUTION_STATUSES.RUNNING,
            rowIdx: 1,
          });
          await client.pause(6000);
          // status should be success
          await checkExecutionRowLayout(client, {
            ...EXECUTION_SLOW_ERROR,
            status: EXECUTION_STATUSES.ERROR,
            rowIdx: 1,
          });
        }),
      );
    });

    describe.only('Execution Table', () => {
      beforeEach(
        mochaAsync(async () => {
          app = await createApplication({
            database: {
              datasets: [
                EXECUTION_FAST.dataset,
                EXECUTION_SLOW.dataset,
                EXECUTION_SLOW_ERROR.dataset,
                EXECUTION_FAST_ERROR.dataset,
              ],
              algorithms: [
                EXECUTION_FAST.algorithm,
                EXECUTION_SLOW.algorithm,
                EXECUTION_SLOW_ERROR.algorithm,
                EXECUTION_FAST_ERROR.algorithm,
              ],
            },
          });
          await app.client.goToExecutions();
        }),
      );

      it(
        'Delete execution',
        mochaAsync(async () => {
          const { client } = app;

          await createExecution(client, EXECUTION_FAST);
          await createExecution(client, EXECUTION_FAST_ERROR);
          await deleteExecution(client, { rowIdx: 0 });
          await checkExecutionRowLayout(client, {
            ...EXECUTION_FAST_ERROR,
            status: EXECUTION_STATUSES.ERROR,
            rowIdx: 0,
          });
        }),
      );

      it(
        'Execute multiple slow executions',
        mochaAsync(async () => {
          const { client } = app;

          await createExecution(client, EXECUTION_SLOW);
          await createExecution(client, EXECUTION_SLOW_ERROR);
          await createExecution(client, EXECUTION_SLOW);
          await createExecution(client, EXECUTION_SLOW);
          await createExecution(client, EXECUTION_SLOW);

          await client.pause(6000);

          await checkExecutionTableLayout(client, [
            {
              ...EXECUTION_SLOW,
              status: EXECUTION_STATUSES.SUCCESS,
            },
            {
              ...EXECUTION_SLOW_ERROR,
              status: EXECUTION_STATUSES.ERROR,
            },
            { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.SUCCESS },
            { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.SUCCESS },
            { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.SUCCESS },
          ]);
        }),
      );

      it(
        'Persist slow execution table',
        mochaAsync(async () => {
          const { client } = app;

          await createExecution(client, EXECUTION_FAST);
          await createExecution(client, EXECUTION_SLOW_ERROR);
          await createExecution(client, EXECUTION_SLOW);
          await createExecution(client, EXECUTION_FAST);

          await client.pause(500);

          await checkExecutionTableLayout(client, [
            {
              ...EXECUTION_FAST,
              status: EXECUTION_STATUSES.SUCCESS,
            },
            {
              ...EXECUTION_SLOW_ERROR,
              status: EXECUTION_STATUSES.RUNNING,
            },
            { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.RUNNING },
            { ...EXECUTION_FAST, status: EXECUTION_STATUSES.SUCCESS },
          ]);

          await client.goToResults();
          await client.pause(6000);
          await client.goToExecutions();

          await checkExecutionTableLayout(client, [
            {
              ...EXECUTION_FAST,
              status: EXECUTION_STATUSES.SUCCESS,
            },
            {
              ...EXECUTION_SLOW_ERROR,
              status: EXECUTION_STATUSES.ERROR,
            },
            { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.SUCCESS },
            { ...EXECUTION_FAST, status: EXECUTION_STATUSES.SUCCESS },
          ]);
        }),
      );
    });
  });
});
