/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { mochaAsync, openDrawer, clearInput } from './utils';
import {
  ALGORITHMS_MENU_ITEM_ID,
  ALGORITHM_TABLE_ID,
  ALGORITHM_NAME_CLASS,
  ALGORITHM_DESCRIPTION_CLASS,
  ALGORITHM_AUTHOR_CLASS,
  ALGORITHM_LANGUAGE_CLASS,
  ALGORITHM_DELETE_BUTTON_CLASS,
  buildAlgorithmRowClass,
  ALGORITHM_ADD_BUTTON_ID,
  ADD_ALGORITHM_NAME_ID,
  ADD_ALGORITHM_DESCRIPTION_ID,
  ADD_ALGORITHM_FILE_LOCATION_ID,
  ADD_ALGORITHM_SAVE_BUTTON_ID,
  ADD_ALGORITHM_BACK_BUTTON_ID,
  ADD_ALGORITHM_FROM_FILE_OPTION_ID,
  ADD_ALGORITHM_FROM_EDITOR_OPTION_ID,
  ALGORITHM_EDIT_BUTTON_CLASS,
  EDIT_ALGORITHM_NAME_ID,
  EDIT_ALGORITHM_DESCRIPTION_ID,
  EDIT_ALGORITHM_SAVE_BUTTON_ID,
  EDIT_ALGORITHM_BACK_BUTTON_ID,
} from '../src/config/selectors';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import {
  GRAASP_ALGORITHMS,
  MISSING_FILE_ALGORITHM,
  SIMPLE_ALGORITHM,
  REPLACEMENT_ALGORITHM,
} from './fixtures/algorithms/algorithms';

const menuGoTo = async (client, selector) => {
  await openDrawer(client);
  const el = await client.$(selector);
  await el.click();
};

const verifyAlgorithm = async (client, algorithm) => {
  const { name, description, author, language } = algorithm;

  const matchedAlgorithm = await client.$(
    `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(name)}`,
  );

  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_NAME_CLASS}`)).getText(),
  ).to.equal(name);
  expect(
    await (
      await matchedAlgorithm.$(`.${ALGORITHM_DESCRIPTION_CLASS}`)
    ).getText(),
  ).to.equal(description.replace(/\s+/g, ' '));
  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_AUTHOR_CLASS}`)).getText(),
  ).to.equal(author);
  expect(
    await (await matchedAlgorithm.$(`.${ALGORITHM_LANGUAGE_CLASS}`)).getText(),
  ).to.equal(language);
};

const getNumberOfAlgorithms = async (client) => {
  return (await client.$$(`#${ALGORITHM_TABLE_ID} .${ALGORITHM_NAME_CLASS}`))
    .length;
};

const addAlgorithmFromFileLocation = async (
  client,
  { name, description, fileLocation },
) => {
  const fileOption = await client.$(`#${ADD_ALGORITHM_FROM_FILE_OPTION_ID}`);
  fileOption.click();

  const nameEl = await client.$(`#${ADD_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${ADD_ALGORITHM_DESCRIPTION_ID}`);
  const fileLocationEl = await client.$(`#${ADD_ALGORITHM_FILE_LOCATION_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
  await fileLocationEl.addValue(fileLocation);
};

const addAlgorithmFromEditor = async (client, { name, description }) => {
  const editorOption = await client.$(
    `#${ADD_ALGORITHM_FROM_EDITOR_OPTION_ID}`,
  );
  await editorOption.click();

  const nameEl = await client.$(`#${ADD_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${ADD_ALGORITHM_DESCRIPTION_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
};

const editAlgorithm = async (client, { name, description }) => {
  const nameEl = await client.$(`#${EDIT_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${EDIT_ALGORITHM_DESCRIPTION_ID}`);

  await clearInput(nameEl);
  await nameEl.setValue(name);
  await clearInput(descriptionEl);
  await descriptionEl.addValue(description);
};

describe('Algorithms Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Correctly adds Graasp algorithms',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      for (const algorithm of GRAASP_ALGORITHMS) {
        // eslint-disable-next-line no-await-in-loop
        await verifyAlgorithm(client, algorithm);
      }
    }),
  );

  it(
    'Correctly deletes algorithms',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);
      expect(nAlgosPrior > 0).to.be.true;

      const deleteButton = await client.$(
        `#${ALGORITHM_TABLE_ID} .${ALGORITHM_DELETE_BUTTON_CLASS}`,
      );
      await deleteButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosPrior - nAlgosAfter).to.equal(1);
    }),
  );

  it(
    'Adding a non existing algorithm does not add it to database',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();
      await addAlgorithmFromFileLocation(client, MISSING_FILE_ALGORITHM);
      const saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(0);
    }),
  );

  it(
    'Correctly adds from file location',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      const saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(1);

      await verifyAlgorithm(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Correctly adds algorithm from editor',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();
      await addAlgorithmFromEditor(client, SIMPLE_ALGORITHM);
      const saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(1);

      await verifyAlgorithm(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Clicking back button before adding algorithm does not add it to database',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();
      await addAlgorithmFromFileLocation(client, MISSING_FILE_ALGORITHM);
      const backButton = await client.$(`#${ADD_ALGORITHM_BACK_BUTTON_ID}`);
      await backButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(0);
    }),
  );

  it(
    'Editing a graasp algorithm creates a copy',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const firstGraaspAlgo = GRAASP_ALGORITHMS[0];
      const { name } = firstGraaspAlgo;

      const firstAlgoEl = await client.$(
        `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(name)}`,
      );

      const editButton = await firstAlgoEl.$(`.${ALGORITHM_EDIT_BUTTON_CLASS}`);
      editButton.click();

      await editAlgorithm(client, REPLACEMENT_ALGORITHM);

      const saveButton = await client.$(`#${EDIT_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton.click();

      const nAlgosAfter = await getNumberOfAlgorithms(client);
      expect(nAlgosAfter - nAlgosPrior).to.equal(1);

      await verifyAlgorithm(client, REPLACEMENT_ALGORITHM);
      await verifyAlgorithm(client, firstGraaspAlgo);
    }),
  );

  it(
    'Clicking back button without saving does not edit algorithm',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      // add algo
      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();
      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);
      const saveButton1 = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton1.click();
      await verifyAlgorithm(client, SIMPLE_ALGORITHM);

      const editButton = await client.$(
        `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(
          SIMPLE_ALGORITHM.name,
        )} .${ALGORITHM_EDIT_BUTTON_CLASS}`,
      );
      await editButton.click();
      await editAlgorithm(client, REPLACEMENT_ALGORITHM);

      // click back button without saving it
      const backButton = await client.$(`#${EDIT_ALGORITHM_BACK_BUTTON_ID}`);
      await backButton.click();

      await verifyAlgorithm(client, SIMPLE_ALGORITHM);
    }),
  );

  it(
    'Adds, edits and deletes and algorithm',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

      const nAlgosPrior = await getNumberOfAlgorithms(client);

      const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
      await addButton.click();

      await addAlgorithmFromFileLocation(client, SIMPLE_ALGORITHM);

      const saveButton1 = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton1.click();

      const nAlgosAfterAdd = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterAdd - nAlgosPrior).to.equal(1);
      await verifyAlgorithm(client, SIMPLE_ALGORITHM);

      const editButton = await client.$(
        `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(
          SIMPLE_ALGORITHM.name,
        )} .${ALGORITHM_EDIT_BUTTON_CLASS}`,
      );
      await editButton.click();

      await editAlgorithm(client, REPLACEMENT_ALGORITHM);

      const saveButton = await client.$(`#${EDIT_ALGORITHM_SAVE_BUTTON_ID}`);
      await saveButton.click();
      const backButton = await client.$(`#${EDIT_ALGORITHM_BACK_BUTTON_ID}`);
      await backButton.click();

      const nAlgosAfterEdit = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterEdit).to.equal(nAlgosAfterAdd);

      const deleteButton = await client.$(
        `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(
          REPLACEMENT_ALGORITHM.name,
        )} .${ALGORITHM_DELETE_BUTTON_CLASS}`,
      );
      await deleteButton.click();

      const nAlgosAfterDelete = await getNumberOfAlgorithms(client);
      expect(nAlgosAfterDelete - nAlgosAfterAdd).to.equal(-1);
    }),
  );
});
