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
  ALGORITHM_DELETE_BUTTON_CLASS,
  ALGORITHM_DESCRIPTION_CLASS,
  ALGORITHM_EDIT_BUTTON_CLASS,
  ALGORITHM_NAME_CLASS,
  ALGORITHM_TABLE_ID,
  buildAlgorithmRowClass,
  EDIT_ALGORITHM_BACK_BUTTON_ID,
  EDIT_ALGORITHM_DESCRIPTION_ID,
  EDIT_ALGORITHM_NAME_ID,
  EDIT_ALGORITHM_SAVE_BUTTON_ID,
  PARAMETER_CLASS,
  PARAMETER_NAME_CLASS,
  PARAMETER_TYPE_CLASS,
  PARAMETER_DESCRIPTION_CLASS,
  PARAMETER_VALUE_CLASS,
  ADD_PARAMETER_BUTTON_ID,
  buildParameterTypeOptionClass,
  ADD_ALGORITHM_DEFAULT_OPTION_ID,
  DEFAULT_ALGORITHM_SELECT_ID,
  buildDefaultAlgorithmOptionId,
  PARAMETERS_FIELD_SELECTOR_SELECT_SCHEMAS_ID,
  buildParameterSchemaOption,
  buildFieldSelectorCheckbox,
  ADD_ALGORITHM_TYPE_SELECT_ID,
  buildAddAlgorithmTypeOptionId,
  EDIT_ALGORITHM_TYPE_SELECT_ID,
  buildEditAlgorithmTypeOptionId,
} from '../../src/config/selectors';
import { PARAMETER_TYPES } from '../../src/shared/constants';
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
    `#${ALGORITHM_TABLE_ID}`,
    `.${buildAlgorithmRowClass(name)}`,
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
  const { name, description, type, author, language } = algorithm;

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
  expect(await matchedAlgorithm.getText()).to.contain(type);
  expect(await matchedAlgorithm.getText()).to.contain(author);
  expect(await matchedAlgorithm.getText()).to.contain(language);
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

export const addAlgorithmFromEditor = async (
  client,
  { name, description, type },
) => {
  const editorOption = await client.$(
    `#${ADD_ALGORITHM_FROM_EDITOR_OPTION_ID}`,
  );
  await editorOption.click();

  const nameEl = await client.$(`#${ADD_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${ADD_ALGORITHM_DESCRIPTION_ID}`);
  const typeEl = await client.$(`#${ADD_ALGORITHM_TYPE_SELECT_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
  await typeEl.click();
  const typeOption = await client.$(`#${buildAddAlgorithmTypeOptionId(type)}`);
  await typeOption.click();
};

export const editAlgorithm = async (client, { name, description, type }) => {
  const nameEl = await client.$(`#${EDIT_ALGORITHM_NAME_ID}`);
  const descriptionEl = await client.$(`#${EDIT_ALGORITHM_DESCRIPTION_ID}`);
  const typeEl = await client.$(`#${EDIT_ALGORITHM_TYPE_SELECT_ID}`);

  await clearInput(nameEl);
  await nameEl.setValue(name);
  await clearInput(descriptionEl);
  await descriptionEl.addValue(description);
  await typeEl.click();
  const typeOption = await client.$(`#${buildEditAlgorithmTypeOptionId(type)}`);
  await typeOption.click();
};

export const addDefaultAlgorithm = async (client, { id }) => {
  const editorOption = await client.$(`#${ADD_ALGORITHM_DEFAULT_OPTION_ID}`);
  await editorOption.click();

  const algorithmSelect = await client.$(`#${DEFAULT_ALGORITHM_SELECT_ID}`);
  await algorithmSelect.click();
  await (await client.$(`#${buildDefaultAlgorithmOptionId(id)}`)).click();
};

export const addParameters = async (client, { parameters }) => {
  const addParameterButton = await client.$(`#${ADD_PARAMETER_BUTTON_ID}`);
  for (const { name, type, description, value, schema } of parameters) {
    await addParameterButton.click();
    const parameterElements = await client.$$(`.${PARAMETER_CLASS}`);
    const lastParameter = parameterElements[parameterElements.length - 1];

    const nameElem = await lastParameter.$(`.${PARAMETER_NAME_CLASS}`);
    await nameElem.setValue(name);

    const typeElem = await lastParameter.$(`.${PARAMETER_TYPE_CLASS}`);
    await typeElem.click();
    const typeOption = await client.$(
      `.${buildParameterTypeOptionClass(type)}`,
    );
    await typeOption.click();

    const descriptionElem = await lastParameter.$(
      `.${PARAMETER_DESCRIPTION_CLASS}`,
    );
    await descriptionElem.setValue(description);

    if (type === PARAMETER_TYPES.FIELD_SELECTOR) {
      // select schema
      if (schema) {
        const schemaSelect = await client.$(
          `#${PARAMETERS_FIELD_SELECTOR_SELECT_SCHEMAS_ID}`,
        );
        await schemaSelect.click();
        await (
          await client.$(`#${buildParameterSchemaOption(schema)}`)
        ).click();
      }

      // check field checkboxes
      // suppose unique checkbox name
      if (value) {
        for (const v of value) {
          const field = await client.$(`#${buildFieldSelectorCheckbox(v)}`);
          await field.click();
        }
      }
    }
    if (type !== PARAMETER_TYPES.FIELD_SELECTOR) {
      const valueElem = await lastParameter.$(`.${PARAMETER_VALUE_CLASS}`);
      await clearInput(valueElem);
      await valueElem.setValue(value);
    }
  }
};
