import { makeContainsFarmers, } from './utils';

import { UNPLOWED, PLOWED, READY_FOR_HARVEST, } from './plotState';

// NB: PLANTED is not useful because it does not require work
const keyPrecedence = [READY_FOR_HARVEST, PLOWED, UNPLOWED,];

const movedFarmer = (farmer, row, col) => {
  return {
    ...farmer,
    row,
    col,
  };
};

export const updateFarmer = (state, farmerIndex) => {
  // in precedence order, find a square matching a certain state which isn't being worked, and go there and work
  const { farmers, squares, numRows, numCols, } = state;
  const myFarmer = farmers.get(farmerIndex);
  const otherFarmers = farmers.remove(farmerIndex);

  const isOccupied = makeContainsFarmers(otherFarmers);

  const currSquare = squares.get(myFarmer.row).get(myFarmer.col);

  // in order, attempt to determine if we can move to an unoccupied square
  // of the given type, and if so, work it
  for (const desiredState of keyPrecedence) {
    if (currSquare.state === desiredState) {
      // then stay here, done
      return myFarmer;
    }

    for (var row = 0; row < numRows; row++) {
      for (var col = 0; col < numCols; col++) {
        const square = squares.get(row).get(col);
        // if it's unoccupied and in the desired state, then move there and we're done
        if (!isOccupied(row, col) && square.state === desiredState) {
          return movedFarmer(myFarmer, row, col);
        }
      }
    }
  }

  // then we were unsuccessful; TODO make them go to sleep or something
  return myFarmer;
};
