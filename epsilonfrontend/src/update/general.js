export const updateGeneral = state => {
  const { general, } = state;

  if (general.paused) {
    return {
      ...state,
      general: {
        ...general,
        ticks: general.ticks + 1,
        pausedTicks: general.pausedTicks + 1,
      },
    };
  }

  return {
    ...state,
    general: {
      ...general,
      ticks: general.ticks + 1,
      runningTicks: general.runningTicks + 1,
    },
  };
};
