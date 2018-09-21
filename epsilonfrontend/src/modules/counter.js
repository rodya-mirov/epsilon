export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED';
export const INCREMENT = 'counter/INCREMENT';
export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED';
export const DECREMENT = 'counter/DECREMENT';

const initialState = {
  count: 0,
  incrementRequests: 0,
  decrementRequests: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case INCREMENT_REQUESTED:
    return {
      ...state,
      incrementRequests: state.incrementRequests + 1,
    };

  case INCREMENT:
    return {
      ...state,
      count: state.count + 1,
      incrementRequests: state.incrementRequests - 1,
    };

  case DECREMENT_REQUESTED:
    return {
      ...state,
      decrementRequests: state.decrementRequests + 1,
    };

  case DECREMENT:
    return {
      ...state,
      count: state.count - 1,
      decrementRequests: state.decrementRequests - 1,
    };

  default:
    return state;
  }
};

export const increment = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_REQUESTED,
    });

    dispatch({
      type: INCREMENT,
    });
  };
};

export const incrementAsync = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_REQUESTED,
    });

    return setTimeout(
      () =>
        dispatch({
          type: INCREMENT,
        }),
      3000
    );
  };
};

export const decrement = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT_REQUESTED,
    });

    dispatch({
      type: DECREMENT,
    });
  };
};

export const decrementAsync = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT_REQUESTED,
    });

    return setTimeout(
      () =>
        dispatch({
          type: DECREMENT,
        }),
      3000
    );
  };
};
