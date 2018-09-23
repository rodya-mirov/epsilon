import { getRequiresWork, } from './plotState';
import { stateChange, } from './utils';

export const updatePlot = square => {
  if (getRequiresWork(square.state)) {
    return square;
  }

  if (square.timeLeftInState <= 0) {
    return stateChange(square);
  } else {
    return {
      ...square,
      timeLeftInState: square.timeLeftInState - 1,
    };
  }
};
