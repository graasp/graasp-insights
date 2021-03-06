/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync, openDrawer } from './utils';
import i18n from '../src/config/i18n';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  ALGORITHMS_EMPTY_ALERT_ID,
  ALGORITHMS_MENU_ITEM_ID,
  ALGORITHM_TABLE_ID,
  buildDatasetsListViewButtonClass,
  DATASETS_EMPTY_ALERT_ID,
  DATASETS_MAIN_ID,
  DATASETS_MENU_ITEM_ID,
  DATASET_SCREEN_MAIN_ID,
  DATASET_TABLE_ID,
  EXECUTIONS_ALERT_NO_DATASET_ID,
  EXECUTIONS_MENU_ITEM_ID,
  RESULTS_MENU_ITEM_ID,
  SCHEMAS_EMPTY_ALERT_ID,
  SCHEMAS_TABLE_ID,
  SETTINGS_LOAD_GRAASP_DATABASE_ID,
  SETTINGS_CLEAR_DATABASE_BUTTON_ID,
  SETTINGS_FILE_SIZE_LIMIT_SELECT_ID,
  SETTINGS_LANG_SELECT,
} from '../src/config/selectors';
import { DEFAULT_LANGUAGE } from '../src/config/constants';
import { DATASET_1000_KB } from './fixtures/datasets/datasets';
import {
  DEFAULT_FILE_SIZE_LIMIT,
  GRAASP_SCHEMA_ID,
  FILE_SIZE_LIMIT_OPTIONS,
} from '../src/shared/constants';
import { PREEXISTING_GRAASP_ALGORITHM } from './fixtures/algorithms/algorithms';
import { DEFAULT_SCHEMAS } from '../public/app/schema/config';

const isLanguageSetTo = async (client, value) => {
  const lang = await (
    await client.$(`#${SETTINGS_LANG_SELECT} input`)
  ).getAttribute('value');
  expect(lang).to.equal(value);
};

const isFileSizeLimitSetTo = async (client, value) => {
  const limit = await (
    await client.$(`#${SETTINGS_FILE_SIZE_LIMIT_SELECT_ID} input`)
  ).getAttribute('value');
  expect(parseInt(limit, 10)).to.equal(value);
};

const changeLanguage = async (client, value) => {
  const languageInput = await client.$(`#${SETTINGS_LANG_SELECT} input`);
  const lang = await languageInput.getAttribute('value');
  if (lang !== value) {
    await (await client.$(`#${SETTINGS_LANG_SELECT}`)).click();
    await (await client.$(`[data-value='${value}']`)).click();
    // update i18n locally
    await i18n.changeLanguage(value);
  }
};

const changeFileSizeLimit = async (client, value) => {
  const input = await client.$(`#${SETTINGS_FILE_SIZE_LIMIT_SELECT_ID} input`);
  const size = await input.getAttribute('value');
  if (size !== value) {
    await (
      await client.$(`#${SETTINGS_FILE_SIZE_LIMIT_SELECT_ID} .MuiSelect-root`)
    ).click();
    await (await client.$(`[data-value='${value}']`)).click();
  }
};

const clearDatabase = async (client) => {
  await (await client.$(`#${SETTINGS_CLEAR_DATABASE_BUTTON_ID}`)).click();
};

const loadGraaspAlgorithms = async (client) => {
  await (await client.$(`#${SETTINGS_LOAD_GRAASP_DATABASE_ID}`)).click();
};

describe('Settings Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  afterEach(() => {
    return closeApplication(app);
  });

  describe('default', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
      }),
    );

    it(
      'default layout',
      mochaAsync(async () => {
        const { client } = app;
        await client.goToSettings();
        await client.expectElementToExist(
          `#${SETTINGS_FILE_SIZE_LIMIT_SELECT_ID}`,
        );
        await client.expectElementToExist(`#${SETTINGS_LANG_SELECT}`);

        await isLanguageSetTo(client, DEFAULT_LANGUAGE);
        await isFileSizeLimitSetTo(client, DEFAULT_FILE_SIZE_LIMIT);
      }),
    );

    it(
      'changing language updates app',
      mochaAsync(async () => {
        const { client } = app;
        await client.goToSettings();
        await changeLanguage(client, 'fr');

        await openDrawer(client);
        const datasets = await (
          await client.$(`#${DATASETS_MENU_ITEM_ID}`)
        ).getHTML();
        expect(datasets).to.contain(i18n.t('Datasets'));
        const algorithms = await (
          await client.$(`#${ALGORITHMS_MENU_ITEM_ID}`)
        ).getHTML();
        expect(algorithms).to.contain(i18n.t('Algorithms'));
        const executions = await (
          await client.$(`#${EXECUTIONS_MENU_ITEM_ID}`)
        ).getHTML();
        expect(executions).to.contain(i18n.t('Executions'));
        const results = await (
          await client.$(`#${RESULTS_MENU_ITEM_ID}`)
        ).getHTML();
        expect(results).to.contain(i18n.t('Results'));
      }),
    );
  });

  describe('File Size Limit', () => {
    it(
      'changing file size limit let user cancel opening of bigger files',
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            datasets: [DATASET_1000_KB],
          },
          responses: { showMessageDialogResponse: 0 },
        });
        const { client } = app;
        const { name } = DATASET_1000_KB;
        await client.goToSettings();
        await changeFileSizeLimit(client, FILE_SIZE_LIMIT_OPTIONS[0]);

        // check going to dataset view can be canceled
        await client.goToDatasets();

        const viewButton = await client.$(
          `.${buildDatasetsListViewButtonClass(name)}`,
        );
        await viewButton.click();

        // user cancels, so we are on datasets page
        await client.expectElementToExist(`#${DATASETS_MAIN_ID}`);
      }),
    );

    it(
      'changing file size limit let user open bigger files without warning',
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            datasets: [DATASET_1000_KB],
          },
        });
        const { client } = app;
        const { name } = DATASET_1000_KB;
        await client.goToSettings();
        await changeFileSizeLimit(client, FILE_SIZE_LIMIT_OPTIONS[3]);

        // check going to dataset view can be canceled
        await client.goToDatasets();

        const viewButton = await client.$(
          `.${buildDatasetsListViewButtonClass(name)}`,
        );
        await viewButton.click();

        // user cancels, so we are on datasets page
        await client.expectElementToExist(`#${DATASET_SCREEN_MAIN_ID}`);
      }),
    );
  });

  describe('Clear database', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            datasets: [DATASET_1000_KB],
            algorithms: [PREEXISTING_GRAASP_ALGORITHM],
            schemas: [DEFAULT_SCHEMAS[GRAASP_SCHEMA_ID]],
          },
          responses: {
            showMessageDialogResponse: 1,
          },
        });
      }),
    );

    it(
      'Clear database',
      mochaAsync(async () => {
        const { client } = app;

        await client.goToSettings();
        await clearDatabase(client);

        // empty datasets
        await client.goToDatasets();
        await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

        // empty algorithms
        await client.goToAlgorithms();
        await client.expectElementToExist(`#${ALGORITHMS_EMPTY_ALERT_ID}`);

        // empty executions
        await client.goToExecutions();
        await client.expectElementToExist(`#${EXECUTIONS_ALERT_NO_DATASET_ID}`);

        // empty schemas
        await client.goToSchemas();
        await client.expectElementToExist(`#${SCHEMAS_EMPTY_ALERT_ID}`);
      }),
    );
  });

  describe('Load Graasp Database', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            datasets: [DATASET_1000_KB],
            algorithms: [PREEXISTING_GRAASP_ALGORITHM],
            schemas: [DEFAULT_SCHEMAS[GRAASP_SCHEMA_ID]],
          },
          responses: {
            showMessageDialogResponse: 1,
          },
        });
      }),
    );

    it(
      'Load Graasp Database',
      mochaAsync(async () => {
        const { client } = app;

        await client.goToSettings();
        await loadGraaspAlgorithms(client);

        await client.goToDatasets();
        await client.expectElementToExist(`#${DATASET_TABLE_ID}`);
        // todo: check dataset

        await client.goToAlgorithms();
        await client.expectElementToExist(`#${ALGORITHM_TABLE_ID}`);
        // todo: check algorithms

        await client.goToSchemas();
        await client.expectElementToExist(`#${SCHEMAS_TABLE_ID}`);
        // todo: check schemas
      }),
    );
  });
});
