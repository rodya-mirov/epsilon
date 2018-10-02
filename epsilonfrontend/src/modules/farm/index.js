import { List, } from 'immutable';
import { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, } from './plotState';
import { makeInitialStateLengths, } from './plotState';

import { alea, } from 'seedrandom';

import { makeFarmerAt, } from './utils';
import { processFarmUpgrades, FARM_UPGRADE_ACTION, } from './upgrades';
export { makeUpgrades, } from './upgrades';

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

const initialTimeLeftInState = ({ state, rng, stateLengths, }) => {
  const random = rng();
  return Math.floor(random * stateLengths[state]);
};

const initialSquare = ({ rng, stateLengths, }) => {
  const state = initialFieldState(rng);
  const timeLeftInState = initialTimeLeftInState({
    state,
    rng,
    stateLengths,
  });
  return { state, timeLeftInState, };
};

// 2D arrays are indexed (row, col) which is (y, x), that's not weird
// This way squares.get(i) is a row (which is how it's rendered)
const makeSquares = (numRows, numCols, squareGen) =>
  List(Array(numRows).keys()).map(() =>
    List(Array(numCols).keys()).map(() => squareGen())
  );

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

const initNumRows = 8;
const initNumCols = 10;
const initNumFarmers = 5;

const makeInitialState = rng => {
  const stateLengths = makeInitialStateLengths();
  return {
    isActive: false,
    upgradesUnlocked: false,
    numRows: initNumRows,
    numCols: initNumCols,
    squares: makeSquares(initNumRows, initNumCols, () =>
      initialSquare({ rng, stateLengths, })
    ),
    farmers: makeFarmers(initNumRows, initNumCols, initNumFarmers),
    stateLengths,
  };
};

export const initialState = makeInitialState(alea('farm rng seed'));

const UNLOCK_FARM_UPGRADES = 'farm/unlockFarmUpgrades';
const UNLOCK_FARM = 'farm/unlockFarm';

export const unlockFarmAction = () => ({
  type: UNLOCK_FARM,
});

export const unlockFarmUpgradesAction = () => ({
  type: UNLOCK_FARM_UPGRADES,
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
  case UNLOCK_FARM_UPGRADES:
    return {
      ...state,
      upgradesUnlocked: true,
    };

  case FARM_UPGRADE_ACTION:
    return processFarmUpgrades(state, action);

  default:
    return state;
  }
};

export { UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST, };
export { getFarmerDescription, } from './plotState';
