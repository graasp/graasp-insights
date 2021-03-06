import { expect } from 'chai';
import path from 'path';
import { mochaAsync } from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  DATASETS_EMPTY_ALERT_ID,
  buildDatasetsListNameClass,
  buildDatasetsListDescriptionClass,
  buildDatasetsListViewButtonClass,
  DATASET_BACK_BUTTON_ID,
  DATASET_NAME_ID,
  DATASET_TABLE_INFORMATION_ID,
  DATASET_TABLE_SPACE_ID_ID,
  LOAD_DATASET_ACCEPT_ID,
  LOAD_DATASET_BUTTON_ID,
  LOAD_DATASET_DESCRIPTION_ID,
  LOAD_DATASET_FILEPATH_ID,
  LOAD_DATASET_NAME_ID,
  DATASET_TABLE_SPACE_NAME_ID,
  DATASET_TABLE_SUBSPACE_COUNT_ID,
  DATASET_TABLE_COUNTRY_COUNT_ID,
  DATASET_TABLE_ACTION_COUNT_ID,
  DATASET_TABLE_USER_COUNT_ID,
  buildDatasetsListDeleteButtonClass,
  LOAD_DATASET_CANCEL_BUTTON_ID,
  DATASETS_MAIN_ID,
  DATASET_SCREEN_TABLE_VIEW_ID,
} from '../src/config/selectors';
import {
  SIMPLE_DATASET,
  MISSING_FILE_DATASET,
  CSV_DATASET,
  XLSX_DATASET,
} from './fixtures/datasets/datasets';
import { ADD_DATASET_PAUSE } from './time';
import { GRAASP_SCHEMA_ID } from '../src/shared/constants';
import { DEFAULT_SCHEMAS } from '../public/app/schema/config';

const fillAddDatasetForm = async (client, { name, description, filepath }) => {
  const basename = path.basename(filepath);

  const addButton = await client.$(`#${LOAD_DATASET_BUTTON_ID}`);
  await addButton.click();

  const nameEl = await client.$(`#${LOAD_DATASET_NAME_ID}`);
  const descriptionEl = await client.$(`#${LOAD_DATASET_DESCRIPTION_ID}`);
  const filepathEl = await client.$(`#${LOAD_DATASET_FILEPATH_ID}`);

  // fill in form
  await filepathEl.addValue(filepath);
  await client.pause(2000);
  // check placeholder
  expect(basename).to.contain(await nameEl.getAttribute('placeholder'));

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
};

const fillAddDatasetFormAndAccept = async (client, dataset) => {
  await fillAddDatasetForm(client, dataset);
  await (await client.$(`#${LOAD_DATASET_ACCEPT_ID}`)).click();
  await client.pause(ADD_DATASET_PAUSE);
};

const addDataset = async (client, dataset) => {
  const { name, description } = dataset;
  await fillAddDatasetFormAndAccept(client, dataset);

  const nameTextEl = await client.$$(`.${buildDatasetsListNameClass(name)}`);
  const descriptionTextEl = await client.$$(
    `.${buildDatasetsListDescriptionClass(name)}`,
  );
  if (nameTextEl.length > 1 || descriptionTextEl.length > 1) {
    // eslint-disable-next-line no-console
    console.warning('two datasets have the same name, this can lead to errors');
  }
  expect(await nameTextEl[0].getText()).to.equal(name);
  expect(await descriptionTextEl[0].getText()).to.equal(description);

  // todo: check size, creation date, etc
};

const viewDataset = async (client, dataset) => {
  const {
    name,
    spaceId,
    spaceName,
    subSpaceCount,
    actionCount,
    userCount,
    countryCount,
  } = dataset;

  const viewButton = await client.$(
    `.${buildDatasetsListViewButtonClass(name)}`,
  );
  await viewButton.click();

  const nameTitle = await client.$(`#${DATASET_NAME_ID}`);
  expect(await nameTitle.getText()).to.equal(name);

  // check info table
  await client.expectElementToExist(`#${DATASET_TABLE_INFORMATION_ID}`);
  expect(
    await (await client.$(`#${DATASET_TABLE_SPACE_ID_ID}`)).getText(),
  ).to.equal(spaceId);
  expect(
    await (await client.$(`#${DATASET_TABLE_SPACE_NAME_ID}`)).getText(),
  ).to.equal(spaceName);
  expect(
    await (await client.$(`#${DATASET_TABLE_SUBSPACE_COUNT_ID}`)).getText(),
  ).to.equal(subSpaceCount);
  expect(
    await (await client.$(`#${DATASET_TABLE_COUNTRY_COUNT_ID}`)).getText(),
  ).to.equal(countryCount);
  expect(
    await (await client.$(`#${DATASET_TABLE_ACTION_COUNT_ID}`)).getText(),
  ).to.equal(actionCount);
  expect(
    await (await client.$(`#${DATASET_TABLE_USER_COUNT_ID}`)).getText(),
  ).to.equal(userCount);
};

const viewTabularDataset = async (client, dataset) => {
  const { name, content } = dataset;

  const viewButton = await client.$(
    `.${buildDatasetsListViewButtonClass(name)}`,
  );
  await viewButton.click();

  const rows = await client.$$(`#${DATASET_SCREEN_TABLE_VIEW_ID} tbody tr`);

  expect(rows.length).to.equal(content.length);

  await Promise.all(
    rows.map(async (row, idx) => {
      const rowText = await row.getText();
      const expectedRow = content[idx];
      Promise.all(
        expectedRow.map((value) => {
          return expect(rowText).to.contain(value);
        }),
      );
    }),
  );
};

// eslint-disable-next-line import/prefer-default-export
export const deleteDataset = async (client, { name }) => {
  const deleteButton = await client.$(
    `.${buildDatasetsListDeleteButtonClass(name)}`,
  );
  await deleteButton.click();
};

describe('Datasets Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          schemas: [DEFAULT_SCHEMAS[GRAASP_SCHEMA_ID]],
        },
        responses: { showMessageDialogResponse: 1 },
      });
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Using an incorrect dataset file location leads to error',
    mochaAsync(async () => {
      const { client } = app;

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

      const dataset = MISSING_FILE_DATASET;
      await fillAddDatasetFormAndAccept(client, dataset);

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);
    }),
  );

  it(
    'Cancel adding dataset does not add it to database',
    mochaAsync(async () => {
      const { client } = app;

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

      const dataset = MISSING_FILE_DATASET;
      await fillAddDatasetForm(client, dataset);
      await (await client.$(`#${LOAD_DATASET_CANCEL_BUTTON_ID}`)).click();

      await client.pause(ADD_DATASET_PAUSE);

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);
    }),
  );

  it(
    'Add, view, delete dataset',
    mochaAsync(async () => {
      const { client } = app;

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

      const dataset = SIMPLE_DATASET;
      await addDataset(client, dataset);
      await viewDataset(client, dataset);
      const backButton = await client.$(`#${DATASET_BACK_BUTTON_ID}`);
      await backButton.click();
      await deleteDataset(client, dataset);
      await client.pause(1000);

      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListNameClass(dataset.name),
      );
      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListDescriptionClass(dataset.name),
      );
    }),
  );

  it(
    'Add, view, delete CSV dataset',
    mochaAsync(async () => {
      const { client } = app;

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

      const dataset = CSV_DATASET;
      await addDataset(client, dataset);
      await viewTabularDataset(client, dataset);
      const backButton = await client.$(`#${DATASET_BACK_BUTTON_ID}`);
      await backButton.click();
      await deleteDataset(client, dataset);
      await client.pause(1000);

      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListNameClass(dataset.name),
      );
      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListDescriptionClass(dataset.name),
      );
    }),
  );

  it(
    'Add, view, delete XLSX dataset',
    mochaAsync(async () => {
      const { client } = app;

      await client.expectElementToExist(`#${DATASETS_EMPTY_ALERT_ID}`);

      const dataset = XLSX_DATASET;
      await addDataset(client, dataset);
      await viewTabularDataset(client, dataset);
      const backButton = await client.$(`#${DATASET_BACK_BUTTON_ID}`);
      await backButton.click();
      await deleteDataset(client, dataset);
      await client.pause(1000);

      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListNameClass(dataset.name),
      );
      await client.expectElementToNotExist(
        `#${DATASETS_MAIN_ID}`,
        buildDatasetsListDescriptionClass(dataset.name),
      );
    }),
  );
});
