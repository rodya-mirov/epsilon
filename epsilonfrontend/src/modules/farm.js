export const FieldStates = {
  UNPLOWED: 'UNPLOWED',
  PLOWED: 'PLOWED',
  PLANTED: 'PLANTED',
  READY_FOR_HARVEST: 'READY_FOR_HARVEST',
};

const initialFieldState = (row, col) => {
  const xor = (row ^ col) % 7;
  if (xor === 0) {
    return FieldStates.PLOWED;
  } else if (xor === 1) {
    return FieldStates.PLANTED;
  } else if (xor === 2) {
    return FieldStates.READY_FOR_HARVEST;
  } else {
    return FieldStates.UNPLOWED;
  }
};

const initialSquare = (row, col) => ({
  state: initialFieldState(row, col),
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

export default (state = initialState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
