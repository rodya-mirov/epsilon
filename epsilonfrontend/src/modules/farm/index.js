import { UPDATE, } from '../update';
import { List, } from 'immutable';
import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
  updateSquares,
} from './plotState';
import { updateFarmer, } from './farmer';
import { reduceReducers, } from 'redux-loop';

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
const initNumFarmers = 5;

const initialState = {
  numRows: initNumRows,
  numCols: initNumCols,
  squares: makeSquares(initNumRows, initNumCols, (row, col) =>
    initialSquare(row, col)
  ),
  farmers: makeFarmers(initNumRows, initNumCols, initNumFarmers),
  oddTick: false,
};

const updateFarmers = state => {
  const numFarmers = state.farmers.size;
  for (var i = 0; i < numFarmers; i++) {
    const farmerMove = updateFarmer(state, i);
    const newFarmers = state.farmers.remove(i).insert(i, farmerMove);
    state = {
      ...state,
      farmers: newFarmers,
    };
  }
  return state;
};

const updateOddTick = state => ({
  ...state,
  oddTick: !state.oddTick,
});

const updatedFarm = reduceReducers(updateSquares, updateFarmers, updateOddTick);

export default (state = initialState, action) => {
  switch (action.type) {
  case UPDATE:
    return updatedFarm(state);
  default:
    return state;
  }
};

export { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, };
export { getFarmerAction, } from './plotState';
