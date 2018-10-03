import { WAITING_FOR_CUSTOMER, BARTERING, ACCOUNTING, } from './merchantState';
import { makeUpgrade, makePowerCostFunction, } from '../../upgrades/utils';
import { MONEY, makeTrySpendAction, } from '../resources';

const upgradePowers = {
  [WAITING_FOR_CUSTOMER]: 2,
  [BARTERING]: 2,
  [ACCOUNTING]: 2,
};

const upgradeMultipliers = {
  [WAITING_FOR_CUSTOMER]: 4,
  [BARTERING]: 4,
  [ACCOUNTING]: 4,
};

const upgradeDescriptions = {
  [WAITING_FOR_CUSTOMER]: 'Speed up time to attract customers',
  [BARTERING]: 'Speed up bartering',
  [ACCOUNTING]: 'Speed up accounting',
};

const powerCostFunction = makePowerCostFunction({
  upgradePowers,
  upgradeMultipliers,
});

export const MARKET_UPGRADE_ACTION = 'market/marketUpgradeAction';

const changePowers = ({ powers, key, amount, }) => ({
  ...powers,
  [key]: powers[key] + amount,
});

export const processMarketUpgrades = (state, action) => {
  switch (action.kind) {
  case BARTERING:
  case WAITING_FOR_CUSTOMER:
  case ACCOUNTING:
    return {
      ...state,
      powers: changePowers({
        powers: state.powers,
        key: action.kind,
        amount: action.amount,
      }),
    };

  default:
    throw new Error(`Unrecognized upgrade kind ${action.kind}`);
  }
};

const makePowerUpgrade = ({ key, oldState, }) => {
  const newState = oldState + 1;
  const cost = { [MONEY]: powerCostFunction({ currentPower: oldState, key, }), };

  return makeUpgrade({
    text: upgradeDescriptions[key],
    oldState,
    newState,
    cost,
    action: dispatch =>
      dispatch(
        makeTrySpendAction({
          cost,
          successAction: {
            type: MARKET_UPGRADE_ACTION,
            kind: key,
            amount: 1,
          },
        })
      ),
  });
};

const makePowerUpgrades = ({ powers, }) => {
  return [WAITING_FOR_CUSTOMER, BARTERING, ACCOUNTING,].map(key =>
    makePowerUpgrade({ key, oldState: powers[key], })
  );
};

// TODO 111: updates usages (stateLengths => powers)
export const makeUpgrades = ({ powers, }) => {
  return makePowerUpgrades({ powers, });
};
