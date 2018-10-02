import { READY_FOR_HARVEST, PLANTED, PLOWED, UNPLOWED, } from './plotState';
import { makeFarmerAt, } from './utils';

import { makeStateLengthUpgrade, } from '../../upgrades';
import { makeUpgrade, makeCost, } from '../../upgrades/utils';
import { MONEY, makeTrySpendAction, } from '../resources';

const HIRE_FARMER = 'farm/upgrades/HIRE_FARMER';

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

const addFarmer = ({ state, numFarmers = 1, }) => {
  let { farmers, } = state;

  for (let i = 0; i < numFarmers; i++) {
    const newFarmer = makeFarmerAt(-1, -1);
    farmers = farmers.push(newFarmer);
  }

  return {
    ...state,
    farmers,
  };
};

export const FARM_UPGRADE_ACTION = 'farm/farmUpgradeAction';

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

const makeFarmerUpgrade = ({ farmers, }) => {
  const numFarmers = farmers.size;
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

export const makeUpgrades = ({ stateLengths, farmers, }) => {
  return [
    makeStateLengthUpgrades({ stateLengths, }),
    [makeFarmerUpgrade({ farmers, }),],
  ].flat();
};
