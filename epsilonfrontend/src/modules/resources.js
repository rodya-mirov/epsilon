export const HARVEST = 'HARVEST';
export const PLANTED = 'PLANTED';

export const harvestAction = (count = 1) => ({
  type: HARVEST,
  count: count,
});

export const plantedAction = (count = 1) => ({
  type: PLANTED,
  count: count,
});

const initState = {
  fruit: 0,
  seeds: 0,
};

export default (state = initState, action) => {
  switch (action.type) {
  case HARVEST:
    return { ...state, fruit: state.fruit + action.count, };

  case PLANTED:
    return { ...state, seeds: state.seeds - action.count, };

  default:
    return state;
  }
};
