import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
} from '../../modules/farm/plotState';

// duration of each state (how many ticks to move it to next)
const StateLength = {
  UNPLOWED: 8,
  PLOWED: 6,
  PLANTED: 60,
  READY_FOR_HARVEST: 6,
};

// whether or not a plot requires work to advance
const RequiresWork = {
  UNPLOWED: true,
  PLOWED: true,
  PLANTED: false,
  READY_FOR_HARVEST: true,
};

// which state you move to next
const NextState = {
  UNPLOWED: PLOWED,
  PLOWED: PLANTED,
  PLANTED: READY_FOR_HARVEST,
  READY_FOR_HARVEST: UNPLOWED,
};

export const getRequiresWork = plotState => RequiresWork[plotState];
export const getStateLength = plotState => StateLength[plotState];
export const getNextState = plotState => NextState[plotState];
