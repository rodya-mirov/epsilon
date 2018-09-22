import { UPDATE, } from './update';
import { List, } from 'immutable';

export const UNPLOWED = 'UNPLOWED';
export const PLOWED = 'PLOWED';
export const PLANTED = 'PLANTED';
export const READY_FOR_HARVEST = 'READY_FOR_HARVEST';

// duration of each state (how many ticks to move it to next)

const KeyPrecedence = [READY_FOR_HARVEST, UNPLOWED, PLANTED, PLOWED,];

const StateLength = {
  UNPLOWED: 8,
  PLOWED: 6,
  PLANTED: 12,
  READY_FOR_HARVEST: 6,
};

// which state you move to next
const NextState = {
  UNPLOWED: PLOWED,
  PLOWED: PLANTED,
  PLANTED: READY_FOR_HARVEST,
  READY_FOR_HARVEST: UNPLOWED,
};

// largely arbitrary field state; deterministic "random" process
const initialFieldState = (row, col) => {
  const xor = (row + (row ^ col)) % 7;
  if (xor === 0) {
    return PLOWED;
  } else if (xor === 1) {
    return PLANTED;
  } else if (xor === 2) {
    return READY_FOR_HARVEST;
  } else {
    return UNPLOWED;
  }
};

const initialSquare = (row, col) => ({
  state: initialFieldState(row, col),
  // no real significance to this number
  timeLeftInState: (row * col) % 6,
});

// 2D arrays are indexed (row, col) which is (y, x), that's not weird
// This way squares.get(i) is a row (which is how it's rendered)
const makeSquares = (numRows, numCols, squareGen) =>
  List(Array(numRows).keys()).map(row =>
    List(Array(numCols).keys()).map(col => squareGen(row, col))
  );

const makeFarmerAt = (row, col) => ({
  row,
  col,
});

const makeFarmers = (numRows, numCols, numFarmers) => {
  var farmers = List();
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
      farmers = farmers.push(makeFarmerAt(row, col));
      if (farmers.size >= numFarmers) {
        return farmers;
      }
    }
  }
  // NB: if numFarmers > numRows*numCols, this makes not enough farmers
  return farmers;
};

const initNumRows = 8;
const initNumCols = 10;
const initNumFarmers = 3;

const initialState = {
  numRows: initNumRows,
  numCols: initNumCols,
  squares: makeSquares(initNumRows, initNumCols, (row, col) =>
    initialSquare(row, col)
  ),
  farmers: makeFarmers(initNumRows, initNumCols, initNumFarmers),
  oddTick: false,
};

const movedFarmer = (farmer, row, col) => {
  return {
    ...farmer,
    row,
    col,
  };
};

const makeContainsFarmers = farmers => (row, col) =>
  farmers.some(farmer => farmer.row === row && farmer.col === col);

const updateFarmer = (state, farmerIndex) => {
  // in precedence order, find a square matching a certain state which isn't being worked, and go there and work
  const { farmers, squares, numRows, numCols, } = state;
  const myFarmer = farmers.get(farmerIndex);
  const otherFarmers = farmers.remove(farmerIndex);

  const isOccupied = makeContainsFarmers(otherFarmers);

  const currSquare = squares.get(myFarmer.row).get(myFarmer.col);

  // in order, attempt to determine if we can move to an unoccupied square
  // of the given type, and if so, work it
  for (const desiredState of KeyPrecedence) {
    if (currSquare.state === desiredState) {
      // then stay here, done
      return state;
    }

    for (var row = 0; row < numRows; row++) {
      for (var col = 0; col < numCols; col++) {
        const square = squares.get(row).get(col);
        // if it's unoccupied and in the desired state, then move there and we're done
        if (!isOccupied(row, col) && square.state === desiredState) {
          return {
            ...state,
            farmers: otherFarmers.insert(
              farmerIndex,
              movedFarmer(myFarmer, row, col)
            ),
          };
        }
      }
    }
  }
  return state;
};

const updateSquare = (square, containsFarmer) => {
  if (square.timeLeftInState <= 0) {
    const nextState = NextState[square.state];
    return {
      ...square,
      state: nextState,
      timeLeftInState: StateLength[nextState],
    };
  } else if (containsFarmer) {
    return {
      ...square,
      timeLeftInState: square.timeLeftInState - 1,
    };
  } else {
    return square;
  }
};

const updateSquares = state => {
  const containsFarmer = makeContainsFarmers(state.farmers);
  return {
    ...state,
    squares: state.squares.map((row, rowInd) =>
      row.map((square, colInd) =>
        updateSquare(square, containsFarmer(rowInd, colInd))
      )
    ),
  };
};

const updatedFarm = state => {
  const numFarmers = state.farmers.size;
  for (var i = 0; i < numFarmers; i++) {
    state = updateFarmer(state, i);
  }

  state = updateSquares(state);

  return {
    ...state,
    oddTick: !state.oddTick,
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
  case UPDATE:
    return updatedFarm(state);
  default:
    return state;
  }
};
