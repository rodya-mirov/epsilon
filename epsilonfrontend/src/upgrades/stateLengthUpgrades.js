import { makeTrySpendAction, MONEY, } from '../modules/resources';
import { makeCost, makeUpgrade, } from './utils';

const moneyCosts = amount => [makeCost({ amount, unit: MONEY, }),];

const tickGainCost = ({ oldLength, multiplier, upgradePower, }) => {
  // TODO: this power is not what I want, it should be a power
  // of number of times it's been upgraded
  const percentGain = oldLength / (oldLength - 1);
  const raisedGain = Math.pow(percentGain, upgradePower);
  return Math.ceil(raisedGain * multiplier);
};

// TODO: these functions seem tied together in an incoherent way
const usualUpgrade = ({
  oldStateLength,
  costFunction,
  description,
  state,
  minValue = 1,
  upgradeActionType,
}) => {
  if (oldStateLength <= minValue) {
    return makeUpgrade({
      text: description,
      oldState: oldStateLength,
      disabled: true,
    });
  }

  const moneyAmount = costFunction(oldStateLength);
  const upgradeAction = makeTrySpendAction({
    cost: { [MONEY]: moneyAmount, },
    successAction: { type: upgradeActionType, kind: state, amount: 1, },
  });

  return makeUpgrade({
    text: description,
    oldState: oldStateLength,
    newState: oldStateLength - 1,
    costs: moneyCosts(moneyAmount),
    action: dispatch => {
      dispatch(upgradeAction);
    },
  });
};

export const makeStateLengthUpgrade = ({
  upgradePowers,
  upgradeMultipliers,
  upgradeDescriptions,
  upgradeActionType,
  defaultUpgradeMultiplier = 10,
  defaultUpgradePower = 2,
}) => {
  const makeUpgradeItem = ({ state, stateLengths, }) => {
    return usualUpgrade({
      upgradeActionType,
      description: upgradeDescriptions[state],
      oldStateLength: stateLengths[state],
      state,
      costFunction: oldLength =>
        tickGainCost({
          oldLength,
          multiplier: upgradeMultipliers[state] || defaultUpgradeMultiplier,
          upgradePower: upgradePowers[state] || defaultUpgradePower,
        }),
    });
  };

  return makeUpgradeItem;
};
