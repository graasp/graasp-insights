import {
  buildExecutionAlgorithmOptionId,
  buildExecutionDatasetOptionId,
  buildParameterValueInputId,
  EXECUTIONS_ALGORITHMS_SELECT_ID,
  EXECUTIONS_DATASETS_SELECT_ID,
  EXECUTIONS_EXECUTE_BUTTON_ID,
  EXECUTION_FORM_NAME_INPUT_ID,
  SET_PARAMETERS_BUTTON_ID,
  SET_PARAMETERS_SAVE_BUTTON_ID,
} from '../../src/config/selectors';
import { clearInput } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const createExecution = async (
  client,
  { dataset, algorithm, name, parameters },
) => {
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

  if (parameters) {
    const setParametersButton = await client.$(`#${SET_PARAMETERS_BUTTON_ID}`);
    await setParametersButton.click();
    for (const { name: parameterName, value } of parameters) {
      const parameterTextField = await client.$(
        `#${buildParameterValueInputId(parameterName)}`,
      );
      await clearInput(parameterTextField);
      parameterTextField.addValue(value);
    }

    await (await client.$(`#${SET_PARAMETERS_SAVE_BUTTON_ID}`)).click();
  }

  await client.pause(1000);

  await (await client.$(`#${EXECUTIONS_EXECUTE_BUTTON_ID}`)).click();
};
