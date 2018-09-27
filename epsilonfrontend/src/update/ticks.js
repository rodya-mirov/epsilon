export const updateTicks = state => {
  const { ticks, } = state;
  return {
    ...state,
    ticks: {
      ...ticks,
      ticks: ticks.ticks + 1,
    },
  };
};
