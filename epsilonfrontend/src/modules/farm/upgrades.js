import { READY_FOR_HARVEST, PLANTED, PLOWED, UNPLOWED, } from './plotState';
import { makeStateLengthUpgrade, } from '../../upgrades';

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

/*
// TODO: use this for hiring
import { makeContainsFarmers, } from './utils';

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

// TODO: use this for hiring 
const addFarmer = state => {
  const newFarmer = anyFarmer(state);
  return newFarmer == null
    ? state
    : {
      ...state,
      farmers: state.farmers.push(newFarmer),
    };
};
*/

export const FARM_UPGRADE_ACTION = 'farm/farmUpgradeAction';

const changeStateLengths = ({ stateLengths, plotState, amount, }) => ({
  ...stateLengths,
  [plotState]: stateLengths[plotState] - amount,
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
        amount: action.amount,
      }),
    };

  default:
    throw new Error(`Unrecognized upgrade kind ${action.kind}`);
  }
};

const upgradeMaker = makeStateLengthUpgrade({
  upgradePowers,
  upgradeMultipliers,
  upgradeDescriptions,
  upgradeActionType: FARM_UPGRADE_ACTION,
});

export const makeUpgrades = ({ stateLengths, }) => {
  return [UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST,].map(state =>
    upgradeMaker({ state, stateLengths, })
  );
};
