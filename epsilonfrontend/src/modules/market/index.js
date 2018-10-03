import { alea, } from 'seedrandom';

import { makeInitialState, } from './initState';

import { MARKET_UPGRADE_ACTION, processMarketUpgrades, } from './upgrades';
import {
  switchTransaction,
  increasePriorityTransaction,
  decreasePriorityTransaction,
} from './transactions';

/**
 * Description of the state & general actions associated to the market.
 *
 * The market is a grid with:
 * -  Your merchants with stands (really just a list of stand objects)
 * -  Random people wandering around
 *
 * Periodically a person will approach one of your merchants and either
 * sell a seed or purchase a lime (or whatever)
 */

/**
 *
 * A STAND has shape {
 *   xmin: number
 *   ymin: number
 *   xmax: number
 *   ymax: number
 *   merchant: direction
 * }
 *
 * A SQUARE has shape {
 *  type: string (one of the square types, below)
 * }
 *
 * Direction is one of [LEFT, RIGHT, TOP, BOTTOM]
 * Orientation is one of [HORIZONTAL, VERTICAL], derived from merchant direction (left/right -> vertical, top/bottom -> horizontal)
 * Customer position is on the opposite side (left <-> right, top <-> bottom)
 */

export const initialState = makeInitialState(
  // absolutely yes, I messed with this string until I liked the result
  alea('This is an rng seed for initializatio')
);

const UNLOCK_MARKET = 'market/unlockMarket';
const ALTER_TRANSACTIONS = 'market/alterTransactions';

const SWITCH = 'market/switch';
const INCREASE_PRIORITY = 'market/increasePriority';
const DECREASE_PRIORITY = 'market/decreasePriority';

export const increasePriorityAction = ({ index, }) => ({
  type: ALTER_TRANSACTIONS,
  kind: INCREASE_PRIORITY,
  index,
});

export const decreasePriorityAction = ({ index, }) => ({
  type: ALTER_TRANSACTIONS,
  kind: DECREASE_PRIORITY,
  index,
});

export const switchTransactionAction = ({ index, }) => ({
  type: ALTER_TRANSACTIONS,
  kind: SWITCH,
  index,
});

const processAlterTransactions = (state, action) => {
  const { transactions, } = state;
  const { kind, index, } = action;

  const newTransactions = (() => {
    switch (kind) {
    case SWITCH:
      return switchTransaction({ transactions, index, });

    case INCREASE_PRIORITY:
      return increasePriorityTransaction({ transactions, index, });

    case DECREASE_PRIORITY:
      return decreasePriorityTransaction({ transactions, index, });

    default:
      throw new Error(`Unrecoginized transaction alteration kind ${kind}`);
    }
  })();

  return {
    ...state,
    transactions: newTransactions,
  };
};

export const unlockMarketAction = () => ({
  type: UNLOCK_MARKET,
});

// currently no available actions
export default (state = initialState, action) => {
  const { isActive, } = state;
  if (!isActive) {
    switch (action.type) {
    case UNLOCK_MARKET:
      return {
        ...state,
        isActive: true,
      };

    default:
      return state;
    }
  }

  switch (action.type) {
  case MARKET_UPGRADE_ACTION:
    return processMarketUpgrades(state, action);

  case ALTER_TRANSACTIONS:
    return processAlterTransactions(state, action);

  default:
    return state;
  }
};
