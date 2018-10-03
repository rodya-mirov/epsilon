import { MONEY, SEEDS, LIMES, } from '../resources';
import { List, } from 'immutable';

export const BUY_SEEDS = 'market/transactions/buySeeds';
export const SELL_LIMES = 'market/transactions/sellLimes';

const transactions = {
  [BUY_SEEDS]: { costs: { [MONEY]: 1, }, gains: { [SEEDS]: 1, }, },
  [SELL_LIMES]: { costs: { [LIMES]: 1, }, gains: { [MONEY]: 5, }, },
};

export const initTransactions = () =>
  List.of(BUY_SEEDS, SELL_LIMES).map(name => ({
    ...transactions[name],
    activated: true,
  }));

export const switchTransaction = ({ transactions, index, }) => {
  if (index < 0 || index >= transactions.size) {
    return transactions;
  }

  return transactions.update(index, t => ({ ...t, activated: !t.activated, }));
};

export const increasePriorityTransaction = ({ transactions, index, }) => {
  if (index < 1 || index >= transactions.size) {
    return transactions;
  }

  const movingElement = transactions.get(index);
  return transactions.delete(index).insert(index - 1, movingElement);
};

export const decreasePriorityTransaction = ({ transactions, index, }) =>
  increasePriorityTransaction({ transactions, index: index + 1, });
