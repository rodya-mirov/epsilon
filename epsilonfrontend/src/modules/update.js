// Used for all time-related update methods
export const UPDATE = 'UPDATE';

export const update = () => {
  return dispatch => {
    dispatch({
      type: UPDATE,
    });
  };
};
