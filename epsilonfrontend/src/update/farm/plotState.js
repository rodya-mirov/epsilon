import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
} from '../../modules/farm/plotState';

// whether or not a plot requires work to advance
const RequiresWork = {
  UNPLOWED: true,
  PLOWED: true,
  PLANTED: false,
  READY_FOR_HARVEST: true,
};

// which state a plot transitions to
const NextState = {
  UNPLOWED: PLOWED,
  PLOWED: PLANTED,
  PLANTED: READY_FOR_HARVEST,
  READY_FOR_HARVEST: UNPLOWED,
};

export const getRequiresWork = plotState => RequiresWork[plotState];
export const getNextState = plotState => NextState[plotState];
