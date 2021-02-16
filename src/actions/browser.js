import { toastr } from 'react-redux-toastr';
import { OPEN_URL_IN_BROWSER_CHANNEL } from '../shared/channels';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_OPENING_URL_IN_BROWSER_MESSAGE,
} from '../shared/messages';

// eslint-disable-next-line import/prefer-default-export
export const openUrlInBrowser = (url) => {
  try {
    window.ipcRenderer.send(OPEN_URL_IN_BROWSER_CHANNEL, url);
  } catch (err) {
    toastr.error(ERROR_MESSAGE_HEADER, ERROR_OPENING_URL_IN_BROWSER_MESSAGE);
  }
};
