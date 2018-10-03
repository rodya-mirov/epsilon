import { reduceReducers, } from 'redux-loop';
import { List, } from 'immutable';

import {
  getNextState,
  BARTERING,
  ACCOUNTING,
  WAITING_FOR_CUSTOMER,
} from '../../modules/market/merchantState';

import { updatePedestrians, } from './pedestrians';

const canAfford = ({ resources, transaction, }) => {
  const { costs, } = transaction;
  return Object.keys(costs).every(
    resourceType => resources[resourceType] >= costs[resourceType]
  );
};

const afforadableTransactions = ({ resources, transactions, }) => {
  return transactions
    .filter(t => t.activated)
    .filter(transaction => canAfford({ resources, transaction, }));
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

const startTransaction = ({ resources, transactions, }) => {
  for (const transaction of afforadableTransactions({
    resources,
    transactions,
  })) {
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

const updateMerchantStand = ({
  merchantStand,
  resources,
  stateLengths,
  transactions,
}) => {
  const { state, timeLeftInState, } = merchantStand;
  if (timeLeftInState <= 0) {
    const newState = getNextState(state);
    const newTimeLeftInState = stateLengths[newState] - 1;

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
      return finisher(startTransaction({ resources, transactions, }));
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
  const { stateLengths, transactions, } = oldMarket;

  let merchantStands = List();
  let resources = oldResources;

  for (const merchantStand of oldMarket.merchantStands) {
    const updated = updateMerchantStand({
      merchantStand,
      resources,
      stateLengths,
      transactions,
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
