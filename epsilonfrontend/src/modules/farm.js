import { UPDATE, } from './update';

export const UNPLOWED = 'UNPLOWED';
export const PLOWED = 'PLOWED';
export const PLANTED = 'PLANTED';
export const READY_FOR_HARVEST = 'READY_FOR_HARVEST';

// really it's not so simple but just putting this in for now to get updates working
const StateLength = {
  UNPLOWED: 7,
  PLOWED: 2,
  PLANTED: 5,
  READY_FOR_HARVEST: 3,
};

const NextState = {
  UNPLOWED: PLOWED,
  PLOWED: PLANTED,
  PLANTED: READY_FOR_HARVEST,
  READY_FOR_HARVEST: UNPLOWED,
};

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
  timeInState: (row * col) % 6,
});

// 2D arrays are indexed (row, col) which is (y, x), that's not weird
// This way squares[i] is a row (which is how it's rendered)
const makeSquares = (numRows, numCols, squareGen) =>
  [...Array(numRows).keys(),].map(row =>
    [...Array(numCols).keys(),].map(col => squareGen(row, col))
  );

const initNumRows = 8;
const initNumCols = 10;

const initialState = {
  numRows: initNumRows,
  numCols: initNumCols,
  squares: makeSquares(initNumRows, initNumCols, (row, col) =>
    initialSquare(row, col)
  ),
};

const updateSquare = square => {
  const stateLength = StateLength[square.state];
  if (square.timeInState >= stateLength) {
    return {
      ...square,
      timeInState: square.timeInState - stateLength + 1,
      state: NextState[square.state],
    };
  } else {
    return {
      ...square,
      timeInState: square.timeInState + 1,
    };
  }
};

const updatedFarm = state => ({
  /// not updating anything but the squares ...
  ...state,
  squares: state.squares.map(row => row.map(updateSquare)),
});

export default (state = initialState, action) => {
  switch (action.type) {
  case UPDATE:
    return updatedFarm(state);
  default:
    return state;
  }
};
