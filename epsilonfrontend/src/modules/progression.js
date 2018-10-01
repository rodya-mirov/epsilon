export const initialState = {
  marketUnlockStarted: false,
};

// for now it's just a state, it has no associated actions
export default (state = initialState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
