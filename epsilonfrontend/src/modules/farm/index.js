import { List, } from 'immutable';
import { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, } from './plotState';
import { getStateLength, } from '../../update/farm/plotState';
import { makeContainsFarmers, } from './utils';

import { alea, } from 'seedrandom';

// largely arbitrary field state; deterministic "random" process from the input
const initialFieldState = rng => {
  const random = rng();
  if (random < 0.1) {
    return PLOWED;
  } else if (random < 0.2) {
    return PLANTED;
  } else if (random < 0.3) {
    return READY_FOR_HARVEST;
  } else {
    return UNPLOWED;
  }
};

const initialTimeLeftInState = (state, rng) => {
  const random = rng();
  return Math.floor(random * getStateLength(state));
};

const initialSquare = rng => {
  const state = initialFieldState(rng);
  const timeLeftInState = initialTimeLeftInState(state, rng);
  return { state, timeLeftInState, };
};

// 2D arrays are indexed (row, col) which is (y, x), that's not weird
// This way squares.get(i) is a row (which is how it's rendered)
const makeSquares = (numRows, numCols, squareGen) =>
  List(Array(numRows).keys()).map(() =>
    List(Array(numCols).keys()).map(() => squareGen())
  );

const makeFarmerAt = (row, col) => ({
  row,
  col,
  working: false,
});

const anyFarmer = ({ numRows, numCols, farmers, }) => {
  const isOccuppied = makeContainsFarmers(farmers);
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!isOccuppied(row, col)) {
        return makeFarmerAt(row, col);
      }
    }
  }
  return null;
};

// makes initial farmers
const makeFarmers = (numRows, numCols, numFarmers) => {
  let farmers = List();
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
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

const makeInitialState = rng => {
  return {
    isActive: false,
    numRows: initNumRows,
    numCols: initNumCols,
    squares: makeSquares(initNumRows, initNumCols, () => initialSquare(rng)),
    farmers: makeFarmers(initNumRows, initNumCols, initNumFarmers),
  };
};

export const initialState = makeInitialState(alea('farm rng seed'));

const UNLOCK_FARM = 'farm/unlockFarm';

export const unlockFarmAction = () => ({
  type: UNLOCK_FARM,
});

export default (state = initialState, action) => {
  const { isActive, } = state;
  if (!isActive) {
    switch (action.type) {
    case UNLOCK_FARM:
      return {
        ...state,
        isActive: true,
      };

    default:
      return state;
    }
  }

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
