import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  CREATE_VALIDATION_CHANNEL,
  EXECUTE_VALIDATION_ALGORITHM_CHANNEL,
  GET_VALIDATIONS_CHANNEL,
  DELETE_VALIDATION_CHANNEL,
  buildExecuteValidationAlgorithmChannel,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
  STOP_VALIDATION_EXECUTION_CHANNEL,
} from '../shared/channels';
import {
  FLAG_EXECUTING_VALIDATION_ALGORITHM,
  FLAG_CREATING_VALIDATION,
  FLAG_GETTING_VALIDATIONS,
  FLAG_DELETING_VALIDATION,
  FLAG_STOPPING_VALIDATION_EXECUTION,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_EXECUTING_VALIDATION_MESSAGE,
  ERROR_GETTING_VALIDATIONS_MESSAGE,
  ERROR_DELETING_VALIDATION_MESSAGE,
  ERROR_CREATING_VALIDATION_MESSAGE,
  ERROR_CANCELING_EXECUTION_MESSAGE,
} from '../shared/messages';
import { createExecution } from './executions';

export const getValidations = () => (dispatch) => {
  const flagGettingValidations = createFlag(FLAG_GETTING_VALIDATIONS);
  try {
    dispatch(flagGettingValidations(true));
    // tell electron to get validations
    window.ipcRenderer.send(GET_VALIDATIONS_CHANNEL);
    window.ipcRenderer.once(GET_VALIDATIONS_CHANNEL, async (event, payload) => {
      dispatch(payload);
      return dispatch(flagGettingValidations(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_VALIDATIONS_MESSAGE);
    dispatch(flagGettingValidations(false));
  }
};

export const executeValidation = (validation) => (dispatch) => {
  const { id: validationId, executions, source, schemaId } = validation;

  executions.forEach((execution) => {
    const flagExecutingValidationAlgorithm = createFlag(
      FLAG_EXECUTING_VALIDATION_ALGORITHM,
    );
    try {
      dispatch(flagExecutingValidationAlgorithm(true));

      const { id: executionId } = execution;

      const channel = buildExecuteValidationAlgorithmChannel(
        validationId,
        executionId,
      );
      window.ipcRenderer.send(EXECUTE_VALIDATION_ALGORITHM_CHANNEL, {
        validationId,
        execution,
        source,
        schemaId,
      });
      window.ipcRenderer.once(channel, async (event, payload) => {
        dispatch(payload);
        dispatch(flagExecutingValidationAlgorithm(false));
      });
    } catch (err) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_EXECUTING_VALIDATION_MESSAGE);
      dispatch(flagExecutingValidationAlgorithm(false));
    }
  });
};

export const createValidation = ({
  sourceId,
  algorithms,
  schemaId,
  autoStart = true,
}) => (dispatch) => {
  const flagCreatingValidation = createFlag(FLAG_CREATING_VALIDATION);
  try {
    dispatch(flagCreatingValidation(true));

    algorithms.forEach(({ id, parameters }) => {
      createExecution({
        algorithmId: id,
        sourceId,
        parameters,
        schemaId,
        autoStart,
      });
    });

    // tell electron to create a validation
    window.ipcRenderer.send(CREATE_VALIDATION_CHANNEL, {
      sourceId,
      algorithms,
      schemaId,
    });
    window.ipcRenderer.once(
      CREATE_VALIDATION_CHANNEL,
      async (event, payload) => {
        dispatch(payload);
        dispatch(flagCreatingValidation(false));

        // automatically start the execution if no error
        const { payload: validation } = payload;
        if (!payload.error && validation && autoStart) {
          executeValidation(validation)(dispatch);
        }
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_CREATING_VALIDATION_MESSAGE);
    dispatch(flagCreatingValidation(false));
  }
};

export const deleteValidation = ({ id, name }) => (dispatch) => {
  const flagDeletingValidation = createFlag(FLAG_DELETING_VALIDATION);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, { name });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingValidation(true));

          window.ipcRenderer.send(DELETE_VALIDATION_CHANNEL, { id });
          window.ipcRenderer.once(
            DELETE_VALIDATION_CHANNEL,
            async (event, payload) => {
              dispatch(payload);
              dispatch(flagDeletingValidation(false));
            },
          );
        }
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_VALIDATION_MESSAGE);
    dispatch(flagDeletingValidation(false));
  }
};

export const cancelValidationExecution = ({ validationId, executionId }) => (
  dispatch,
) => {
  const flagStoppingExecution = createFlag(FLAG_STOPPING_VALIDATION_EXECUTION);
  try {
    dispatch(flagStoppingExecution(true));

    window.ipcRenderer.send(STOP_VALIDATION_EXECUTION_CHANNEL, {
      validationId,
      executionId,
    });
    window.ipcRenderer.once(
      STOP_VALIDATION_EXECUTION_CHANNEL,
      async (e, payload) => {
        dispatch(payload);
        return dispatch(flagStoppingExecution(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_CANCELING_EXECUTION_MESSAGE);
    dispatch(flagStoppingExecution(false));
  }
};
