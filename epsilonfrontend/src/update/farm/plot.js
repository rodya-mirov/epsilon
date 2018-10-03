import { getRequiresWork, } from './plotState';
import { stateChange, } from './utils';

export const updatePlot = ({ square, stateLengths, powers, }) => {
  const squareState = square.state;
  if (getRequiresWork(squareState)) {
    return square;
  }

  if (square.timeLeftInState <= 0) {
    return stateChange({ square, stateLengths, });
  } else {
    return {
      ...square,
      timeLeftInState: square.timeLeftInState - powers[squareState],
    };
  }
};
