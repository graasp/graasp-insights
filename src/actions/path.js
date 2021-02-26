import { toastr } from 'react-redux-toastr';
import { OPEN_PATH_CHANNEL } from '../shared/channels';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_OPENING_PATH_MESSAGE,
} from '../shared/messages';

// eslint-disable-next-line import/prefer-default-export
export const openPath = (path) => {
  try {
    window.ipcRenderer.send(OPEN_PATH_CHANNEL, path);
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_OPENING_PATH_MESSAGE);
  }
};
