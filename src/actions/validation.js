import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import {
  CREATE_VALIDATION_CHANNEL,
  GET_VALIDATIONS_CHANNEL,
  DELETE_VALIDATION_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
} from '../shared/channels';
import {
  FLAG_CREATING_VALIDATION,
  FLAG_GETTING_VALIDATIONS,
  FLAG_DELETING_VALIDATION,
} from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_VALIDATIONS_MESSAGE,
  ERROR_DELETING_VALIDATION_MESSAGE,
  ERROR_CREATING_VALIDATION_MESSAGE,
} from '../shared/messages';
import { executeAlgorithm } from './executions';

export const getValidations = () => (dispatch) => {
  const flagGettingValidations = createFlag(FLAG_GETTING_VALIDATIONS);
  try {
    dispatch(flagGettingValidations(true));
    // tell electron to get validations
    window.ipcRenderer.send(GET_VALIDATIONS_CHANNEL);
    window.ipcRenderer.once(GET_VALIDATIONS_CHANNEL, async (event, payload) => {
      dispatch(payload);
      dispatch(flagGettingValidations(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_VALIDATIONS_MESSAGE);
    dispatch(flagGettingValidations(false));
  }
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

        // automatically start the executions if no error
        const {
          payload: { validation },
        } = payload;
        if (!payload.error && validation && autoStart) {
          const { executions } = validation;
          executions.forEach((executionId) => {
            executeAlgorithm({ id: executionId })(dispatch);
          });
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
