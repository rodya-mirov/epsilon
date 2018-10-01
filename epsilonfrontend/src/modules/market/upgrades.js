import { WAITING_FOR_CUSTOMER, BARTERING, ACCOUNTING, } from './merchantState';
import { makeStateLengthUpgrade, } from '../../upgrades';

const upgradePowers = {
  [WAITING_FOR_CUSTOMER]: 2,
  [BARTERING]: 2,
  [ACCOUNTING]: 2,
};

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

export const MARKET_UPGRADE_ACTION = 'market/marketUpgradeAction';

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

const upgradeMaker = makeStateLengthUpgrade({
  upgradePowers,
  upgradeMultipliers,
  upgradeDescriptions,
  upgradeActionType: MARKET_UPGRADE_ACTION,
});

export const makeUpgrades = ({ stateLengths, }) => {
  return [BARTERING, WAITING_FOR_CUSTOMER, ACCOUNTING,].map(state =>
    upgradeMaker({ state, stateLengths, })
  );
};
