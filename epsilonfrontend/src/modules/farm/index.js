import { List, } from 'immutable';
import { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, } from './plotState';
import { makeContainsFarmers, } from './utils';

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
  working: false,
});

const anyFarmer = ({ numRows, numCols, farmers, }) => {
  const isOccuppied = makeContainsFarmers(farmers);
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
      if (!isOccuppied(row, col)) {
        return makeFarmerAt(row, col);
      }
    }
  }
  return null;
};

// makes initial farmers
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

const addFarmer = state => {
  const newFarmer = anyFarmer(state);
  return newFarmer == null
    ? state
    : {
      ...state,
      farmers: state.farmers.push(newFarmer),
    };
};

const initNumRows = 8;
const initNumCols = 10;
const initNumFarmers = 5;

export const initialState = {
  numRows: initNumRows,
  numCols: initNumCols,
  squares: makeSquares(initNumRows, initNumCols, (row, col) =>
    initialSquare(row, col)
  ),
  farmers: makeFarmers(initNumRows, initNumCols, initNumFarmers),
  oddTick: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case HIRE_FARMER_ACTION_TYPE:
    return addFarmer(state);
  default:
    return state;
  }
};

export const HIRE_FARMER_ACTION_TYPE = 'HIRE_FARMER';
export const hireFarmerAction = (count = 1) => ({
  type: HIRE_FARMER_ACTION_TYPE,
  count,
});

export { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, };
export { getFarmerDescription, } from './plotState';
