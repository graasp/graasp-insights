// eslint-disable-next-line import/prefer-default-export
export const createFlag = (type) => (payload) => (dispatch) =>
  dispatch({
    type,
    payload,
  });
