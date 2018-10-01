import { WAITING_FOR_CUSTOMER, BARTERING, ACCOUNTING, } from './merchantState';
import { MONEY, } from '../resources';
import { makeTrySpendAction, } from '../resources';

const defaultUpgradePower = 2;

const upgradePowers = {
  [WAITING_FOR_CUSTOMER]: 2,
  [BARTERING]: 2,
  [ACCOUNTING]: 2,
};

const defaultUpgradeMultiplier = 10;

const upgradeMultipliers = {
  [WAITING_FOR_CUSTOMER]: 10,
  [BARTERING]: 10,
  [ACCOUNTING]: 10,
};

const upgradeDescriptions = {
  [WAITING_FOR_CUSTOMER]: 'Reduce time between customers',
  [BARTERING]: 'Reduce bartering time',
  [ACCOUNTING]: 'Reduce accounting time',
};

const makeCost = ({ amount, unit, }) => ({ amount, unit, });

const moneyCosts = amount => [makeCost({ amount, unit: MONEY, }),];

const makeUpgrade = ({ text, oldState, newState, costs, action, }) => ({
  text,
  oldState,
  newState,
  costs,
  action,
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

export const MARKET_UPGRADE_ACTION = 'market/marketUpgradeAction';

// TODO: these functions seem tied together in an incoherent way
const usualUpgrade = ({ oldTicks, costFunction, description, plotState, }) => {
  if (oldTicks <= 1) {
    return undefined; // TODO something else (disabled button?)
  }

  const moneyAmount = costFunction(oldTicks);
  const upgradeAction = makeTrySpendAction({
    cost: { [MONEY]: moneyAmount, },
    successAction: { type: MARKET_UPGRADE_ACTION, kind: plotState, amount: 1, },
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

export const processMarketUpgrades = (state, action) => {
  switch (action.kind) {
  case BARTERING:
  case WAITING_FOR_CUSTOMER:
  case ACCOUNTING:
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
  return [BARTERING, WAITING_FOR_CUSTOMER, ACCOUNTING,].map(plotState =>
    makeUpgradeItem({ plotState, stateLengths, })
  );
};
