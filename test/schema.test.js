import { expect } from 'chai';
import { mochaAsync, clearInput } from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  ADD_SCHEMA_CONFIRM_BUTTON_ID,
  ADD_SCHEMA_DESCRIPTION_ID,
  ADD_SCHEMA_FROM_DATASET_SELECT_ID,
  ADD_SCHEMA_LABEL_ID,
  buildDatasetOptionClass,
  buildDatasetRowClass,
  buildSchemaRowClass,
  buildSchemaTagClass,
  DATASETS_MAIN_ID,
  SCHEMAS_ADD_BUTTON_ID,
  SCHEMAS_DELETE_SCHEMA_BUTTON_CLASS,
  SCHEMAS_TABLE_ID,
  SCHEMAS_VIEW_SCHEMA_BUTTON_CLASS,
  SCHEMA_DESCRIPTION_CLASS,
  SCHEMA_VIEW_BACK_BUTTON_ID,
  SCHEMA_VIEW_DESCRIPTION_ID,
  SCHEMA_VIEW_LABEL_ID,
  SCHEMA_VIEW_SAVE_BUTTON_ID,
} from '../src/config/selectors';
import { DEFAULT_SCHEMAS } from '../public/app/schema/config';
import {
  BLANK_SCHEMA,
  REPLACEMENT_SCHEMA,
  SCHEMA_FROM_DATASET,
} from './fixtures/schema/schemas';
import { SIMPLE_DATASET } from './fixtures/datasets/datasets';

const fillAddSchemaForm = async (
  client,
  { label, description, fromDataset },
) => {
  const labelTextField = await client.$(`#${ADD_SCHEMA_LABEL_ID}`);
  await clearInput(labelTextField);
  await labelTextField.addValue(label);

  const descriptionTextField = await client.$(`#${ADD_SCHEMA_DESCRIPTION_ID}`);
  await clearInput(descriptionTextField);
  await descriptionTextField.addValue(description);

  if (fromDataset) {
    const fromDatasetSelect = await client.$(
      `#${ADD_SCHEMA_FROM_DATASET_SELECT_ID}`,
    );
    await fromDatasetSelect.click();
    const datasetMenuOption = await client.$(
      `.${buildDatasetOptionClass(fromDataset)}`,
    );
    await datasetMenuOption.click();
  }
};

const fillViewSchema = async (client, { label, description }) => {
  const labelTextField = await client.$(`#${SCHEMA_VIEW_LABEL_ID}`);
  await clearInput(labelTextField);
  await labelTextField.addValue(label);

  const descriptionTextField = await client.$(`#${SCHEMA_VIEW_DESCRIPTION_ID}`);
  await clearInput(descriptionTextField);
  await descriptionTextField.addValue(description);
};

const checkSchemaLayout = async (client, { label, description }) => {
  const schemaTableRow = await client.$(
    `#${SCHEMAS_TABLE_ID} .${buildSchemaRowClass(label)}`,
  );

  // check label
  const schemaTagLabel = await schemaTableRow.$(
    `.${buildSchemaTagClass(label)}`,
  );
  const labelText = await schemaTagLabel.getText();
  expect(labelText).to.equal(label);

  // check description
  const schemaDescription = await schemaTableRow.$(
    `.${SCHEMA_DESCRIPTION_CLASS}`,
  );
  const descriptionText = await schemaDescription.getText();
  expect(descriptionText).to.equal(description);
};

const deleteSchema = async (client, { label }) => {
  const schemaTableRow = await client.$(
    `#${SCHEMAS_TABLE_ID} .${buildSchemaRowClass(label)}`,
  );
  const deleteButton = await schemaTableRow.$(
    `.${SCHEMAS_DELETE_SCHEMA_BUTTON_CLASS}`,
  );
  await deleteButton.click();
};

describe('Schemas Schenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          datasets: [SIMPLE_DATASET],
        },
        responses: { showMessageDialogResponse: 1 },
      });
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Correctly adds default schemas',
    mochaAsync(async () => {
      const { client } = app;

      await client.goToSchemas();
      Object.values(DEFAULT_SCHEMAS).forEach(async ({ label }) => {
        await client.expectElementToExist(
          `#${SCHEMAS_TABLE_ID} .${buildSchemaTagClass(label)}`,
        );
      });
    }),
  );

  it(
    'Correctly adds, edits and deletes blank schema',
    mochaAsync(async () => {
      const { client } = app;

      await client.goToSchemas();

      // click add schema button, fill the form and click add schema confirm button
      const addSchemaButton = await client.$(`#${SCHEMAS_ADD_BUTTON_ID}`);
      await addSchemaButton.click();
      await fillAddSchemaForm(client, BLANK_SCHEMA);
      const addSchemaConfirmButton = await client.$(
        `#${ADD_SCHEMA_CONFIRM_BUTTON_ID}`,
      );
      await addSchemaConfirmButton.click();

      // verify schema info
      await checkSchemaLayout(client, BLANK_SCHEMA);

      // go to schema view
      const schemaViewButton = await client.$(
        `#${SCHEMAS_TABLE_ID} .${buildSchemaRowClass(
          BLANK_SCHEMA.label,
        )} .${SCHEMAS_VIEW_SCHEMA_BUTTON_CLASS}`,
      );
      await schemaViewButton.click();

      // replace
      await fillViewSchema(client, REPLACEMENT_SCHEMA);

      // save
      const schemaViewSaveButton = await client.$(
        `#${SCHEMA_VIEW_SAVE_BUTTON_ID}`,
      );
      await schemaViewSaveButton.click();

      // go back to schemas
      const schemaViewBackButton = await client.$(
        `#${SCHEMA_VIEW_BACK_BUTTON_ID}`,
      );
      await schemaViewBackButton.click();

      // verify replaced schema info
      await checkSchemaLayout(client, REPLACEMENT_SCHEMA);

      // delete schema
      await deleteSchema(client, REPLACEMENT_SCHEMA);

      // verify deletion
      await client.expectElementToNotExist(
        `#${SCHEMAS_TABLE_ID}`,
        `.${buildSchemaRowClass(REPLACEMENT_SCHEMA.label)}`,
      );
    }),
  );

  it(
    'Adding a blank schema adds it to a dataset',
    mochaAsync(async () => {
      const { client } = app;

      await client.goToSchemas();

      // click add schema button, fill the form and click add schema confirm button
      const addSchemaButton = await client.$(`#${SCHEMAS_ADD_BUTTON_ID}`);
      await addSchemaButton.click();
      await fillAddSchemaForm(client, BLANK_SCHEMA);
      const addSchemaConfirmButton = await client.$(
        `#${ADD_SCHEMA_CONFIRM_BUTTON_ID}`,
      );
      await addSchemaConfirmButton.click();

      // verify schema tag in dataset
      await client.goToDatasets();
      await client.expectElementToExist(
        `#${DATASETS_MAIN_ID} .${buildDatasetRowClass(
          SIMPLE_DATASET.name,
        )} .${buildSchemaTagClass(BLANK_SCHEMA.label)}`,
      );
    }),
  );

  it(
    'Correctly adds a schema from a dataset',
    mochaAsync(async () => {
      const { client } = app;

      await client.goToSchemas();

      // click add schema button, fill the form and click add schema confirm button
      const addSchemaButton = await client.$(`#${SCHEMAS_ADD_BUTTON_ID}`);
      await addSchemaButton.click();
      await fillAddSchemaForm(client, SCHEMA_FROM_DATASET);
      const addSchemaConfirmButton = await client.$(
        `#${ADD_SCHEMA_CONFIRM_BUTTON_ID}`,
      );
      await addSchemaConfirmButton.click();

      // verify schema info
      await checkSchemaLayout(client, SCHEMA_FROM_DATASET);

      // verify schema tag in dataset
      await client.goToDatasets();
      await client.expectElementToExist(
        `#${DATASETS_MAIN_ID} .${buildDatasetRowClass(
          SIMPLE_DATASET.name,
        )} .${buildSchemaTagClass(SCHEMA_FROM_DATASET.label)}`,
      );
    }),
  );
});
