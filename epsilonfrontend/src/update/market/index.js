import { reduceReducers, } from 'redux-loop';
import { List, } from 'immutable';

import {
  getNextState,
  getStateLength,
  BARTERING,
  ACCOUNTING,
} from '../../modules/market/merchantState';

import { updatePedestrians, } from './pedestrians';

const seedTransaction = {
  name: 'seeds',
  costs: { money: 1, },
  gains: { seeds: 1, },
};

const fruitTransaction = {
  name: 'fruit',
  costs: { fruit: 1, },
  gains: { money: 5, },
};

const transactionPrecedence = [seedTransaction, fruitTransaction,];

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
  for (const transaction of transactionPrecedence) {
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

const updateMerchantStand = (merchantStand, resources) => {
  const { state, timeLeftInState, } = merchantStand;
  if (timeLeftInState <= 0) {
    const newState = getNextState(state);
    const newTimeLeftInState = getStateLength(newState);

    const finisher = ({ transaction = undefined, resources, }) => ({
      resources,
      merchantStand: {
        ...merchantStand,
        state: newState,
        timeLeftInState: newTimeLeftInState,
        transaction: transaction,
      },
    });

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

  let merchantStands = List();
  let resources = oldResources;

  for (const merchantStand of oldMarket.merchantStands) {
    const updated = updateMerchantStand(merchantStand, resources);
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

export const updateMarket = reduceReducers(updateMerchants, updatePedestrians);
