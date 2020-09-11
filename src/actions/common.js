const createFlag = (type) => (payload) => (dispatch) =>
  dispatch({
    type,
    payload,
  });

// eslint-disable-next-line import/prefer-default-export
export { createFlag };
