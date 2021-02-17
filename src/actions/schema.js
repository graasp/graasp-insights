import { toastr } from 'react-redux-toastr';
import {
  DELETE_SCHEMA_CHANNEL,
  GET_SCHEMAS_CHANNEL,
  SET_SCHEMA_CHANNEL,
  SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
} from '../shared/channels';
import {
  ERROR_DELETING_SCHEMA_MESSAGE,
  ERROR_GETTING_SCHEMAS_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_SETTING_SCHEMA_MESSAGE,
} from '../shared/messages';
import {
  FLAG_DELETING_SCHEMA,
  FLAG_GETTING_SCHEMAS,
  FLAG_SETTING_SCHEMA,
} from '../shared/types';
import { createFlag } from './common';

const getSchemas = async () => (dispatch) => {
  const flagGettingSchemas = createFlag(FLAG_GETTING_SCHEMAS);
  try {
    dispatch(flagGettingSchemas(true));
    window.ipcRenderer.send(GET_SCHEMAS_CHANNEL);
    window.ipcRenderer.once(GET_SCHEMAS_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagGettingSchemas(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_SCHEMAS_MESSAGE);
    dispatch(flagGettingSchemas(false));
  }
};

const setSchema = async (schema) => (dispatch) => {
  const flagSettingSchema = createFlag(FLAG_SETTING_SCHEMA);
  try {
    dispatch(flagSettingSchema(true));
    window.ipcRenderer.send(SET_SCHEMA_CHANNEL, schema);
    window.ipcRenderer.once(SET_SCHEMA_CHANNEL, (event, response) => {
      dispatch(response);
      dispatch(flagSettingSchema(false));
    });
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_SETTING_SCHEMA_MESSAGE);
    dispatch(flagSettingSchema(false));
  }
};

const deleteSchema = async (schema) => (dispatch) => {
  const flagDeletingSchema = createFlag(FLAG_DELETING_SCHEMA);
  try {
    window.ipcRenderer.send(SHOW_CONFIRM_DELETE_PROMPT_CHANNEL, {
      name: schema.label,
    });
    window.ipcRenderer.once(
      SHOW_CONFIRM_DELETE_PROMPT_CHANNEL,
      async (e, shouldDelete) => {
        if (shouldDelete) {
          dispatch(flagDeletingSchema(true));
          window.ipcRenderer.send(DELETE_SCHEMA_CHANNEL, schema);
          window.ipcRenderer.once(DELETE_SCHEMA_CHANNEL, (event, response) => {
            dispatch(response);
          });
        }
        dispatch(flagDeletingSchema(false));
      },
    );
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_DELETING_SCHEMA_MESSAGE);
    dispatch(flagDeletingSchema(false));
  }
};

export { getSchemas, setSchema, deleteSchema };
