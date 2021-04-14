import { expect } from 'chai';
import {
  EDIT_PIPELINE_DESCRIPTION_ID,
  EDIT_PIPELINE_NAME_ID,
  PIPELINE_FORM_SAVE_BUTTON_ID,
  PIPELINE_ADD_BUTTON_ID,
  PIPELINE_NAME_CLASS,
  PIPELINE_TABLE_ID,
  buildPipelineRowClass,
  ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID,
  ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID,
  CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID,
  PIPELINE_DELETE_BUTTON_CLASS,
  PIPELINE_EDIT_BUTTON_CLASS,
  EDIT_PIPELINE_BACK_BUTTON_ID,
  buildPanelAlgorithmPipelineAccordionId,
  buildPanelTypographyAlgorithmId,
  buildRemoveAlgorithmPipelineAccordionButtonId,
} from '../../src/config/selectors';
import { clearInput } from '../utils';
import { ALGORITHMS_PIPELINES } from '../fixtures/pipelines/pipelines';

export const clickAddButton = async (client) => {
  const addButton = await client.$(`#${PIPELINE_ADD_BUTTON_ID}`);
  await addButton.click();
};

export const clickPipelineDeleteButton = async (client, { name }) => {
  const deleteButton = await client.$(
    `#${PIPELINE_TABLE_ID} .${buildPipelineRowClass(
      name,
    )} .${PIPELINE_DELETE_BUTTON_CLASS}`,
  );
  await deleteButton.click();
  await client.expectElementToNotExist(
    `#${PIPELINE_TABLE_ID}`,
    `.${buildPipelineRowClass(name)}`,
  );
};

export const clickSavePipelineButton = async (client) => {
  const saveButton = await client.$(`#${PIPELINE_FORM_SAVE_BUTTON_ID}`);
  await saveButton.click();
};

export const checkPipelineRowLayout = async (client, pipeline) => {
  const { name } = pipeline;

  const matchedAlgorithm = await client.$(
    `#${PIPELINE_TABLE_ID} .${buildPipelineRowClass(name)}`,
  );

  expect(
    await (await matchedAlgorithm.$(`.${PIPELINE_NAME_CLASS}`)).getText(),
  ).to.equal(name);
};

export const addPipeline = async (client, { name, description }) => {
  const nameEl = await client.$(`#${EDIT_PIPELINE_NAME_ID}`);
  const descriptionEl = await client.$(`#${EDIT_PIPELINE_DESCRIPTION_ID}`);

  await nameEl.addValue(name);
  await descriptionEl.addValue(description);
};

export const addAlgorithmToPipeline = async (client, algorithm) => {
  const datasetSelect = await client.$(
    `#${ADD_ALGORITHM_PIPELINE_ACCORDION_BUTTON_ID}`,
  );
  await datasetSelect.click();

  const dialogAlgorithmSelect = await client.$(
    `#${ALGORITHM_DIALOG_PIPELINE_ACCORDION_SELECT_ID}`,
  );
  await dialogAlgorithmSelect.click();

  await (await client.$(`#${algorithm.id}`)).click();

  const dialogConfirmAlgorithmSelect = await client.$(
    `#${CONFIRM_ADD_ALGORITHM_PIPELINE_ACCORDION_ID}`,
  );
  await dialogConfirmAlgorithmSelect.click();
};

export const clickEditPipelineButton = async (client, { name }) => {
  const editPipelineSelect = await client.$(
    `#${PIPELINE_TABLE_ID} .${buildPipelineRowClass(
      name,
    )} .${PIPELINE_EDIT_BUTTON_CLASS}`,
  );

  await editPipelineSelect.click();
};

export const removeAlgorithmPipeline = async (client, algorithmIndex) => {
  const expandAccordionAlgorithmSelect = await client.$(
    `#${buildPanelAlgorithmPipelineAccordionId(algorithmIndex)}`,
  );
  await expandAccordionAlgorithmSelect.click();

  const removeAlgorithmSelect = await client.$(
    `#${buildRemoveAlgorithmPipelineAccordionButtonId(algorithmIndex)}`,
  );
  await removeAlgorithmSelect.click();
};

export const clickDeletePipelineButton = async (client, { name }) => {
  const deletePipelineSelect = await client.$(
    `#${PIPELINE_TABLE_ID} .${buildPipelineRowClass(
      name,
    )} .${PIPELINE_DELETE_BUTTON_CLASS}`,
  );
  await deletePipelineSelect.click();

  await client.expectElementToNotExist(
    `#${PIPELINE_TABLE_ID}`,
    `.${buildPipelineRowClass(name)}`,
  );
};

export const getNumberOfPipelines = async (client) => {
  return (await client.$$(`#${PIPELINE_TABLE_ID} .${PIPELINE_NAME_CLASS}`))
    .length;
};

export const editNamePipeline = async (client, { name }) => {
  const nameEl = await client.$(`#${EDIT_PIPELINE_NAME_ID}`);
  await clearInput(nameEl);
  await nameEl.addValue(name);
};

export const editDescriptionPipeline = async (client, { description }) => {
  const descriptionEl = await client.$(`#${EDIT_PIPELINE_DESCRIPTION_ID}`);
  await clearInput(descriptionEl);
  await descriptionEl.addValue(description);
};

export const clickEditPipelineBackButton = async (client) => {
  const backButton = await client.$(`#${EDIT_PIPELINE_BACK_BUTTON_ID}`);
  await backButton.click();
};

export const checkAlgorithmStillInPipeline = async (client, algorithm) => {
  const algorithmIndex = ALGORITHMS_PIPELINES.findIndex(
    (x) => x.id === algorithm.id,
  );

  const expandAccordionAlgorithmSelect = await client.$(
    `#${buildPanelAlgorithmPipelineAccordionId(algorithmIndex)}`,
  );
  await expandAccordionAlgorithmSelect.click();

  const nameAlgorithmPipelineSelect = await client.$(
    `#${buildPanelTypographyAlgorithmId(algorithm.id, algorithmIndex)}`,
  );

  expect(await nameAlgorithmPipelineSelect.getText()).to.equal(algorithm.name);
};

export const checkOrderAlgorithmPipeline = async (client) => {
  for (const algorithm of ALGORITHMS_PIPELINES) {
    const { name, id } = algorithm;
    const algorithmIndex = ALGORITHMS_PIPELINES.findIndex((x) => x.id === id);

    const expandAccordionAlgorithmSelect = await client.$(
      `#${buildPanelAlgorithmPipelineAccordionId(algorithmIndex)}`,
    );
    await expandAccordionAlgorithmSelect.click();

    const nameAlgorithmPipelineSelect = await client.$(
      `#${buildPanelTypographyAlgorithmId(id, algorithmIndex)}`,
    );

    expect(await nameAlgorithmPipelineSelect.getText()).to.equal(name);
  }
};
