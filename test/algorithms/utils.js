import { expect } from 'chai';
import {
  ADD_ALGORITHM_BACK_BUTTON_ID,
  ADD_ALGORITHM_DESCRIPTION_ID,
  ADD_ALGORITHM_FILE_LOCATION_ID,
  ADD_ALGORITHM_FROM_EDITOR_OPTION_ID,
  ADD_ALGORITHM_FROM_FILE_OPTION_ID,
  ADD_ALGORITHM_NAME_ID,
  ADD_ALGORITHM_SAVE_BUTTON_ID,
  ALGORITHMS_MENU_ITEM_ID,
  ALGORITHM_ADD_BUTTON_ID,
  ALGORITHM_AUTHOR_CLASS,
  ALGORITHM_DELETE_BUTTON_CLASS,
  ALGORITHM_DESCRIPTION_CLASS,
  ALGORITHM_EDIT_BUTTON_CLASS,
  ALGORITHM_LANGUAGE_CLASS,
  ALGORITHM_NAME_CLASS,
  ALGORITHM_TABLE_ID,
  buildAlgorithmRowClass,
  EDIT_ALGORITHM_BACK_BUTTON_ID,
  EDIT_ALGORITHM_DESCRIPTION_ID,
  EDIT_ALGORITHM_NAME_ID,
  EDIT_ALGORITHM_SAVE_BUTTON_ID,
} from '../../src/config/selectors';
import { clearInput, menuGoTo } from '../utils';

export const menuGoToAlgorithms = (client) =>
  menuGoTo(client, `#${ALGORITHMS_MENU_ITEM_ID}`);

export const clickAddButton = async (client) => {
  const addButton = await client.$(`#${ALGORITHM_ADD_BUTTON_ID}`);
  await addButton.click();
};

export const clickAlgoDeleteButton = async (client, { name }) => {
  const deleteButton = await client.$(
    `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(
      name,
    )} .${ALGORITHM_DELETE_BUTTON_CLASS}`,
  );
  await deleteButton.click();
  await client.expectElementToNotExist(
    `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(name)}`,
  );
};

export const clickAlgoEditButton = async (client, { name }) => {
  const editButton = await client.$(
    `#${ALGORITHM_TABLE_ID} .${buildAlgorithmRowClass(
      name,
    )} .${ALGORITHM_EDIT_BUTTON_CLASS}`,
  );

  await editButton.click();
};

export const clickAddAlgoSaveButton = async (client) => {
  const saveButton = await client.$(`#${ADD_ALGORITHM_SAVE_BUTTON_ID}`);
  await saveButton.click();
};

export const clickAddAlgoBackButton = async (client) => {
  const backButton = await client.$(`#${ADD_ALGORITHM_BACK_BUTTON_ID}`);
  await backButton.click();
};

export const clickEditAlgoSaveButton = async (client) => {
  const saveButton = await client.$(`#${EDIT_ALGORITHM_SAVE_BUTTON_ID}`);
  await saveButton.click();
};

export const clickEditAlgoBackButton = async (client) => {
  const backButton = await client.$(`#${EDIT_ALGORITHM_BACK_BUTTON_ID}`);
  await backButton.click();
};

export const checkAlgorithmRowLayout = async (client, algorithm) => {
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

export const getNumberOfAlgorithms = async (client) => {
  return (await client.$$(`#${ALGORITHM_TABLE_ID} .${ALGORITHM_NAME_CLASS}`))
    .length;
};

export const addAlgorithmFromFileLocation = async (
  client,
  { name, description, fileLocation },
) => {
  const fileOption = await client.$(`#${ADD_ALGORITHM_FROM_FILE_OPTION_ID}`);
  await fileOption.click();

  const nameEl = await client.$(`#${ADD_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${ADD_ALGORITHM_DESCRIPTION_ID}`);
  const fileLocationEl = await client.$(`#${ADD_ALGORITHM_FILE_LOCATION_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
  await fileLocationEl.addValue(fileLocation);
};

export const addAlgorithmFromEditor = async (client, { name, description }) => {
  const editorOption = await client.$(
    `#${ADD_ALGORITHM_FROM_EDITOR_OPTION_ID}`,
  );
  await editorOption.click();

  const nameEl = await client.$(`#${ADD_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${ADD_ALGORITHM_DESCRIPTION_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
};

export const editAlgorithm = async (client, { name, description }) => {
  const nameEl = await client.$(`#${EDIT_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${EDIT_ALGORITHM_DESCRIPTION_ID}`);

  await clearInput(nameEl);
  await nameEl.setValue(name);
  await clearInput(descriptionEl);
  await descriptionEl.addValue(description);
};
