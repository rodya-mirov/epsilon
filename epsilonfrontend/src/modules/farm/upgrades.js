import { READY_FOR_HARVEST, PLANTED, PLOWED, UNPLOWED, } from './plotState';
import { makeFarmerAt, } from './utils';

import { makeStateLengthUpgrade, } from '../../upgrades';
import { makeUpgrade, makeCost, } from '../../upgrades/utils';
import { MONEY, makeTrySpendAction, } from '../resources';
import { arrayGridToImmutable, makeArrayGrid, } from '../../utils';

const MAX_NUM_COLS = 20;
const MAX_NUM_ROWS = 20;

export const FARM_UPGRADE_ACTION = 'farm/farmUpgradeAction';

const HIRE_FARMER = 'farm/upgrades/HIRE_FARMER';
const ENLARGE_FARM = 'farm/upgrades/ENLARGE_FARM';

const upgradePowers = {
  READY_FOR_HARVEST: 2,
  UNPLOWED: 2,
  PLOWED: 2,
  PLANTED: 2,
};

const upgradeMultipliers = {
  READY_FOR_HARVEST: 10,
  UNPLOWED: 10,
  PLOWED: 10,
  PLANTED: 10,
};

const upgradeDescriptions = {
  READY_FOR_HARVEST: 'Reduce harvest time',
  UNPLOWED: 'Reduce plowing time',
  PLOWED: 'Reduce planting time',
  PLANTED: 'Reduce growing time',
};

const makeFieldUpgrade = ({ numRows, numCols, }) => {
  const sizeString = (rows, cols) => `${rows}x${cols}`;

  const newNumRows = numRows >= MAX_NUM_ROWS ? numRows : numRows + 1;
  const newNumCols = numCols >= MAX_NUM_COLS ? numCols : numCols + 1;

  if (newNumRows === numRows && newNumCols === numCols) {
    return makeUpgrade({
      text: 'Enlarge your field',
      oldState: sizeString(numRows, numCols),
      disabled: true,
    });
  }

  const upgradeCost = 12 * (newNumRows * newNumCols - numRows * numCols);

  return makeUpgrade({
    text: 'Enlarge your field',
    oldState: sizeString(numRows, numCols),
    newState: sizeString(newNumRows, newNumCols),
    costs: [makeCost({ amount: upgradeCost, unit: MONEY, }),],
    action: dispatch =>
      dispatch(
        makeTrySpendAction({
          cost: { [MONEY]: upgradeCost, },
          successAction: {
            type: FARM_UPGRADE_ACTION,
            kind: ENLARGE_FARM,
            newSize: { numRows: newNumRows, numCols: newNumCols, },
          },
        })
      ),
  });
};

const enlargeFarm = ({ state, newSize, }) => {
  const { numRows: newNumRows, numCols: newNumCols, } = newSize;
  const {
    squares: oldSquares,
    numRows: oldNumRows,
    numCols: oldNumCols,
    stateLengths,
  } = state;

  const makeSquare = (rowInd, colInd) => {
    if (rowInd < oldNumRows && colInd < oldNumCols) {
      return oldSquares.get(rowInd).get(colInd);
    }

    return { state: UNPLOWED, timeLeftInState: stateLengths[UNPLOWED], };
  };

  return {
    ...state,
    squares: arrayGridToImmutable(
      makeArrayGrid(newNumRows, newNumCols, makeSquare)
    ),
    numRows: newNumRows,
    numCols: newNumCols,
  };
};

const addFarmer = ({ state, toAdd = 1, }) => {
  let { farmers, } = state;

  for (let i = 0; i < toAdd; i++) {
    const newFarmer = makeFarmerAt(-1, -1);
    farmers = farmers.push(newFarmer);
  }

  const numFarmers = farmers.size;

  return {
    ...state,
    farmers,
    numFarmers,
  };
};

const changeStateLengths = ({ stateLengths, plotState, amount, }) => ({
  ...stateLengths,
  [plotState]: stateLengths[plotState] + amount,
});

export const processFarmUpgrades = (state, action) => {
  switch (action.kind) {
  case READY_FOR_HARVEST:
  case PLANTED:
  case PLOWED:
  case UNPLOWED:
    return {
      ...state,
      stateLengths: changeStateLengths({
        stateLengths: state.stateLengths,
        plotState: action.kind,
        amount: -action.amount,
      }),
    };

  case HIRE_FARMER:
    return addFarmer({ state, numFarmers: action.amount, });

  case ENLARGE_FARM:
    return enlargeFarm({ state, newSize: action.newSize, });

  default:
    throw new Error(`Unrecognized upgrade kind ${action.kind}`);
  }
};

const stateLengthUpgradeMaker = makeStateLengthUpgrade({
  upgradePowers,
  upgradeMultipliers,
  upgradeDescriptions,
  upgradeActionType: FARM_UPGRADE_ACTION,
});

const makeStateLengthUpgrades = ({ stateLengths, }) => {
  return [UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST,].map(state =>
    stateLengthUpgradeMaker({ state, stateLengths, })
  );
};

const makeFarmerUpgrade = ({ numFarmers, }) => {
  const moneyAmount = 8 * numFarmers;

  const hireAction = makeTrySpendAction({
    cost: { [MONEY]: moneyAmount, },
    successAction: {
      type: FARM_UPGRADE_ACTION,
      kind: HIRE_FARMER,
      amount: 1,
    },
  });

  return makeUpgrade({
    text: 'Hire farmer',
    oldState: numFarmers,
    newState: numFarmers + 1,
    costs: [makeCost({ amount: moneyAmount, unit: MONEY, }),],
    action: dispatch => dispatch(hireAction),
  });
};

export const makeUpgrades = ({
  stateLengths,
  numFarmers,
  numRows,
  numCols,
}) => {
  return [
    makeStateLengthUpgrades({ stateLengths, }),
    [makeFarmerUpgrade({ numFarmers, }),],
    [makeFieldUpgrade({ numRows, numCols, }),],
  ].flat();
};
