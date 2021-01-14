import { toastr } from 'react-redux-toastr';
import { GET_SCHEMAS_CHANNEL } from '../shared/channels';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_SCHEMAS_MESSAGE,
} from '../shared/messages';
import { FLAG_GETTING_SCHEMAS } from '../shared/types';
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

// eslint-disable-next-line import/prefer-default-export
export { getSchemas };
