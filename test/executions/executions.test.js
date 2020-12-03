/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync } from '../utils';
import {
  createApplication,
  closeApplication,
  getVarFolder,
} from '../application';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  WAIT_FOR_SLOW_ALGORITHMS_PAUSE,
} from '../constants';
import {
  buildExecutionAlgorithmOptionId,
  buildExecutionDatasetOptionId,
  buildExecutionRowAlgorithmButtonId,
  buildExecutionRowSourceButtonId,
  DATASET_BACK_BUTTON_ID,
  DATASET_SCREEN_MAIN_ID,
  EDIT_ALGORITHM_MAIN_ID,
  EXECUTIONS_ALERT_NO_DATASET_ID,
  EXECUTIONS_ALGORITHMS_SELECT_ID,
  EXECUTIONS_DATASETS_SELECT_ID,
  EXECUTIONS_EXECUTE_BUTTON_ID,
  EXECUTIONS_EXECUTION_DELETE_BUTTON_CLASS,
  EXECUTIONS_MAIN_ID,
  EXECUTIONS_TABLE_ID,
  EXECUTION_FORM_NAME_INPUT_ID,
  EXECUTION_TABLE_ROW_BUTTON_CLASS,
  RESULTS_MAIN_ID,
} from '../../src/config/selectors';
import {
  EXECUTION_FAST,
  EXECUTION_FAST_ERROR,
  EXECUTION_SLOW_ERROR,
  EXECUTION_SLOW,
} from '../fixtures/executions/executions';
import { EXECUTION_STATUSES } from '../../src/shared/constants';
import { deleteDataset } from '../dataset.test';

const createExecution = async (client, { dataset, algorithm, name }) => {
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

  await (await client.$(`#${EXECUTION_FORM_NAME_INPUT_ID}`)).addValue(name);

  await client.pause(1000);

  await (await client.$(`#${EXECUTIONS_EXECUTE_BUTTON_ID}`)).click();
};

const checkExecutionRowLayout = async (
  client,
  { dataset, algorithm, name, status, rowIdx },
) => {
  const trs = await client.$$(`#${EXECUTIONS_TABLE_ID} tr`);
  const tr = trs[trs.length - rowIdx - 1]; // more recent is first, skip header

  const executionName = name || `${dataset.name}_${algorithm.name}`;

  const sourceName = await tr.$(
    `#${buildExecutionRowSourceButtonId(dataset.id)}`,
  );
  expect(await sourceName.getText()).to.contain(dataset.name);

  const algoName = await tr.$(
    `#${buildExecutionRowAlgorithmButtonId(algorithm.id)}`,
  );
  expect(await algoName.getText()).to.contain(algorithm.name);

  if (status === EXECUTION_STATUSES.SUCCESS) {
    expect(await tr.getHTML()).to.contain(executionName);
  }

  await client.expectElementToExist(`.${status}`);
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
          await client.pause(WAIT_FOR_SLOW_ALGORITHMS_PAUSE);
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
          await client.pause(WAIT_FOR_SLOW_ALGORITHMS_PAUSE);
          // status should be success
          await checkExecutionRowLayout(client, {
            ...EXECUTION_SLOW_ERROR,
            status: EXECUTION_STATUSES.ERROR,
            rowIdx: 1,
          });
        }),
      );
    });

    describe('Execution Table', () => {
      describe('One application', () => {
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
          'Check algorithm and source buttons for execution',
          mochaAsync(async () => {
            const { client } = app;

            const {
              dataset: { id: fastDatasetId, name: fastDatasetName },
              algorithm: { id: fastAlgoId, name: fastAlgoName },
            } = EXECUTION_FAST;

            const resultName = 'resultName';

            await createExecution(client, EXECUTION_FAST, resultName);
            await createExecution(client, EXECUTION_FAST_ERROR);

            // check algo is displayed
            const datasetButton = await client.$(
              `#${buildExecutionRowSourceButtonId(fastDatasetId)}`,
            );
            await datasetButton.click();
            expect(
              await (await client.$(`#${DATASET_SCREEN_MAIN_ID}`)).getHTML(),
            ).to.contain(fastDatasetName);

            // back
            await (await client.$(`#${DATASET_BACK_BUTTON_ID}`)).click();

            // check algo is displayed
            const algoButton = await client.$(
              `#${buildExecutionRowAlgorithmButtonId(fastAlgoId)}`,
            );
            await algoButton.click();
            expect(
              await (await client.$(`#${EDIT_ALGORITHM_MAIN_ID}`)).getHTML(),
            ).to.contain(fastAlgoName);

            // buttons are not available if resources are deleted

            // enable when results tests are written
            // delete result
            // await client.goToResults();
            // await deleteResult(client, { name: resultName });
            // await client.goToExecutions();
            // let disabledDatasetButtons = await client.$$(
            //   `.${EXECUTION_TABLE_ROW_BUTTON_CLASS}`,
            // );

            // let testedElements = 0;
            // for (const button of disabledDatasetButtons) {
            //   const text = await button.getText();
            //   if (text === resultName) {
            //     testedElements += 1;
            //     expect(await button.getAttribute('disabled')).to.equal('true');
            //   }
            // }
            // expect(testedElements > 0).to.be.true;

            // todo: enable when algorithm test are written
            // delete algorithm
            // await client.goToA();
            // await deleteAlgorithm(client, { name: fastAlgoName });
            // await client.goToExecutions();
            //  disabledDatasetButtons = await client.$$(
            //   `.${EXECUTION_TABLE_ROW_BUTTON_CLASS}`,
            // );

            //  testedElements = 0;
            // for (const button of disabledDatasetButtons) {
            //   const text = await button.getText();
            //   if (text === fastAlgoName) {
            //     testedElements += 1;
            //     expect(await button.getAttribute('disabled')).to.equal('true');
            //   }
            // }
            // expect(testedElements > 0).to.be.true;

            // delete dataset
            await client.goToDatasets();
            await deleteDataset(client, { name: fastDatasetName });
            await client.goToExecutions();
            const disabledDatasetButtons = await client.$$(
              `.${EXECUTION_TABLE_ROW_BUTTON_CLASS}`,
            );

            let testedElements = 0;
            for (const button of disabledDatasetButtons) {
              const text = await button.getText();
              if (text === fastDatasetName) {
                testedElements += 1;
                expect(await button.getAttribute('disabled')).to.equal('true');
              }
            }
            expect(testedElements > 0).to.be.true;
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

            await client.pause(WAIT_FOR_SLOW_ALGORITHMS_PAUSE);

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
            await createExecution(client, EXECUTION_FAST);
            await createExecution(client, EXECUTION_SLOW_ERROR);
            await createExecution(client, EXECUTION_SLOW);

            await client.pause(500);

            await checkExecutionTableLayout(client, [
              {
                ...EXECUTION_FAST,
                status: EXECUTION_STATUSES.SUCCESS,
              },
              { ...EXECUTION_FAST, status: EXECUTION_STATUSES.SUCCESS },
              {
                ...EXECUTION_SLOW_ERROR,
                status: EXECUTION_STATUSES.RUNNING,
              },
              { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.RUNNING },
            ]);

            await client.goToResults();
            await client.goToExecutions();

            await checkExecutionTableLayout(client, [
              {
                ...EXECUTION_FAST,
                status: EXECUTION_STATUSES.SUCCESS,
              },
              { ...EXECUTION_FAST, status: EXECUTION_STATUSES.SUCCESS },
              {
                ...EXECUTION_SLOW_ERROR,
                status: EXECUTION_STATUSES.RUNNING,
              },
              { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.RUNNING },
            ]);

            await client.goToResults();
            await client.pause(WAIT_FOR_SLOW_ALGORITHMS_PAUSE);
            await client.goToExecutions();

            await checkExecutionTableLayout(client, [
              {
                ...EXECUTION_FAST,
                status: EXECUTION_STATUSES.SUCCESS,
              },
              { ...EXECUTION_FAST, status: EXECUTION_STATUSES.SUCCESS },
              {
                ...EXECUTION_SLOW_ERROR,
                status: EXECUTION_STATUSES.ERROR,
              },
              { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.SUCCESS },
            ]);
          }),
        );
      });
      describe('Two applications', () => {
        it(
          'Quitting application stops all running executions',
          mochaAsync(async () => {
            const varFolder = getVarFolder();
            app = await createApplication(
              {
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
              },
              varFolder,
            );

            const { client } = app;
            await client.goToExecutions();

            await createExecution(client, EXECUTION_SLOW_ERROR);
            await createExecution(client, EXECUTION_SLOW);

            // quit
            await client.pause(100);
            await closeApplication(app);

            // open new app
            app = await createApplication({ varFolder });

            await app.client.goToExecutions();
            await app.client.pause(1000);
            await checkExecutionTableLayout(app.client, [
              {
                ...EXECUTION_SLOW_ERROR,
                status: EXECUTION_STATUSES.ERROR,
              },
              { ...EXECUTION_SLOW, status: EXECUTION_STATUSES.ERROR },
            ]);
          }),
        );
      });
    });
  });
});
