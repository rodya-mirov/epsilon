import { reduceReducers, } from 'redux-loop';
import { List, } from 'immutable';

import { SEEDS, MONEY, } from '../../modules/resources';

import {
  getNextState,
  BARTERING,
  ACCOUNTING,
  WAITING_FOR_CUSTOMER,
} from '../../modules/market/merchantState';

import { updatePedestrians, } from './pedestrians';

const seedTransaction = {
  name: 'seeds',
  costs: { money: 1, },
  gains: { seeds: 1, },
};

const limeTransaction = {
  name: 'limes',
  costs: { limes: 1, },
  gains: { money: 5, },
};

const transactionPrecedence = ({ resources, }) => {
  const { [SEEDS]: seeds, [MONEY]: money, } = resources;

  if (seeds < 10 || seeds < money / 5) {
    return [seedTransaction, limeTransaction,];
  }

  return [limeTransaction, seedTransaction,];
};

const canAfford = ({ resources, transaction, }) => {
  const { costs, } = transaction;
  return Object.keys(costs).every(
    resourceType => resources[resourceType] >= costs[resourceType]
  );
};

const applyChange = ({ change, resources, mult = 1, }) => {
  const out = { ...resources, };
  for (const key of Object.keys(change)) {
    out[key] += mult * change[key];
  }

  return out;
};

const applyCosts = ({ transaction, resources, }) =>
  applyChange({ change: transaction.costs, resources, mult: -1, });

const applyGains = ({ transaction, resources, }) =>
  applyChange({ change: transaction.gains, resources, });

const startTransaction = ({ resources, }) => {
  for (const transaction of transactionPrecedence({ resources, })) {
    if (canAfford({ resources, transaction, })) {
      return {
        transaction,
        resources: applyCosts({ transaction, resources, }),
      };
    }
  }

  return { resources, transaction: undefined, };
};

const finishTransaction = ({ transaction, resources, }) => ({
  resources: applyGains({ transaction, resources, }),
});

const updateMerchantStand = ({ merchantStand, resources, stateLengths, }) => {
  const { state, timeLeftInState, } = merchantStand;
  if (timeLeftInState <= 0) {
    const newState = getNextState(state);
    const newTimeLeftInState = stateLengths[newState];

    const finisher = ({ transaction = undefined, resources, }) => {
      let finishedState = newState;
      if (newState === BARTERING && !transaction) {
        finishedState = WAITING_FOR_CUSTOMER;
      }
      return {
        resources,
        merchantStand: {
          ...merchantStand,
          state: finishedState,
          timeLeftInState: newTimeLeftInState,
          transaction: transaction,
        },
      };
    };

    if (newState === BARTERING) {
      return finisher(startTransaction({ resources, }));
    } else if (newState === ACCOUNTING) {
      return finisher(
        finishTransaction({ transaction: merchantStand.transaction, resources, })
      );
    }

    // default case
    return finisher({ resources, transaction: undefined, });
  } else {
    return {
      resources,
      merchantStand: {
        ...merchantStand,
        timeLeftInState: merchantStand.timeLeftInState - 1,
      },
    };
  }
};

const updateMerchants = state => {
  const { market: oldMarket, resources: oldResources, } = state;
  const { stateLengths, } = oldMarket;

  let merchantStands = List();
  let resources = oldResources;

  for (const merchantStand of oldMarket.merchantStands) {
    const updated = updateMerchantStand({
      merchantStand,
      resources,
      stateLengths,
    });
    merchantStands = merchantStands.push(updated.merchantStand);
    resources = updated.resources;
  }

  return {
    ...state,
    market: {
      ...oldMarket,
      merchantStands,
    },
    resources,
  };
};

export const updateMarket = state => {
  if (state.general.paused || !state.market.isActive) {
    return state;
  }

  return reduceReducers(updateMerchants, updatePedestrians)(state);
};
