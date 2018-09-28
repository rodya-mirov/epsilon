const SET_PAUSE = 'SET_PAUSE';

export const setPauseAction = wantPause => ({
  type: SET_PAUSE,
  wantPause,
});

export const initialState = {
  ticks: 0,
  runningTicks: 0,
  pausedTicks: 0,
  paused: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_PAUSE:
    return {
      ...state,
      paused: action.wantPause,
    };

  default:
    return state;
  }
};
