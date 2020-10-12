const { List, Map } = require('immutable');
const { GET_ALGORITHMS_SUCCESS } = require('../types');

const INITIAL_STATE = Map({
  algorithms: List(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_ALGORITHMS_SUCCESS:
      return state.setIn(['algorithms'], List(payload));
    default:
      return state;
  }
};
