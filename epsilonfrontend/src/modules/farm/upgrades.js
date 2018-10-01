import { READY_FOR_HARVEST, PLANTED, PLOWED, UNPLOWED, } from './plotState';
import { MONEY, } from '../resources';
import { makeTrySpendAction, } from '../resources';

const defaultUpgradePower = 2;

const upgradePowers = {
  READY_FOR_HARVEST: 2,
  UNPLOWED: 2,
  PLOWED: 2,
  PLANTED: 2,
};

const defaultUpgradeMultiplier = 10;

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

const makeCost = ({ amount, unit, }) => ({ amount, unit, });

const moneyCosts = amount => [makeCost({ amount, unit: MONEY, }),];

const makeUpgrade = ({
  text,
  oldState,
  newState,
  costs = [],
  action = () => {},
  disabled = false,
}) => ({
  text,
  oldState,
  newState,
  costs,
  action,
  disabled,
});

const tickGainCost = ({
  oldTicks,
  upgradePower = defaultUpgradePower,
  multiplier = defaultUpgradeMultiplier,
}) => {
  // TODO: this power is not what I want, it should be a power
  // of number of times it's been upgraded
  const percentGain = oldTicks / (oldTicks - 1);
  const raisedGain = Math.pow(percentGain, upgradePower);
  return Math.ceil(raisedGain * multiplier);
};

/*
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

// TODO: these functions seem tied together in an incoherent way
const usualUpgrade = ({
  oldTicks,
  costFunction,
  description,
  plotState,
  minValue = 1,
}) => {
  if (oldTicks <= minValue) {
    return makeUpgrade({
      text: description,
      oldState: oldTicks,
      disabled: true,
    });
  }

  const moneyAmount = costFunction(oldTicks);
  const upgradeAction = makeTrySpendAction({
    cost: { [MONEY]: moneyAmount, },
    successAction: { type: FARM_UPGRADE_ACTION, kind: plotState, amount: 1, },
  });

  return makeUpgrade({
    text: description,
    oldState: oldTicks,
    newState: oldTicks - 1,
    costs: moneyCosts(moneyAmount),
    action: dispatch => {
      dispatch(upgradeAction);
    },
  });
};

const makeUpgradeItem = ({ plotState, stateLengths, }) =>
  usualUpgrade({
    description: upgradeDescriptions[plotState],
    oldTicks: stateLengths[plotState],
    costFunction: oldTicks =>
      tickGainCost({
        oldTicks,
        multiplier: upgradeMultipliers[plotState] || defaultUpgradeMultiplier,
        upgradePower: upgradePowers[plotState] || defaultUpgradePower,
      }),
    plotState,
  });

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

export const makeUpgrades = ({ stateLengths, }) => {
  return [UNPLOWED, PLOWED, PLANTED, READY_FOR_HARVEST,].map(plotState =>
    makeUpgradeItem({ plotState, stateLengths, })
  );
};
