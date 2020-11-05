import { toastr } from 'react-redux-toastr';
import { createFlag } from './common';
import { EXECUTE_PYTHON_ALGORITHM_CHANNEL } from '../shared/channels';
import { FLAG_EXECUTING_ALGORITHM } from '../shared/types';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_EXECUTING_ALGORITHM_MESSAGE,
  UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE,
} from '../shared/messages';
import { PROGRAMMING_LANGUAGES } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const executeAlgorithm = ({
  datasetId,
  algorithmId,
  language,
  filename,
}) => (dispatch) => {
  const flagExecutingAlgorithm = createFlag(FLAG_EXECUTING_ALGORITHM);

  switch (language) {
    case PROGRAMMING_LANGUAGES.PYTHON:
      try {
        dispatch(flagExecutingAlgorithm(true));
        window.ipcRenderer.send(EXECUTE_PYTHON_ALGORITHM_CHANNEL, {
          datasetId,
          algorithmId,
          filename,
        });
        window.ipcRenderer.once(
          EXECUTE_PYTHON_ALGORITHM_CHANNEL,
          async (event, response) => {
            dispatch(response);
            return dispatch(flagExecutingAlgorithm(false));
          },
        );
      } catch (err) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_EXECUTING_ALGORITHM_MESSAGE);
        dispatch(flagExecutingAlgorithm(false));
      }
      break;

    default:
      toastr.error(ERROR_MESSAGE_HEADER, UNKNOWN_PROGRAMMING_LANGUAGE_MESSAGE);
  }
};
