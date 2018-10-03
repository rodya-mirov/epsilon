import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import {
  increasePriorityAction,
  decreasePriorityAction,
  switchTransactionAction,
} from '../../modules/market';

import { toEnglishList, } from '../../utils';

const resourceString = costs => {
  const costStrings = Object.keys(costs).map(key => `${costs[key]} ${key}`);
  return toEnglishList(costStrings);
};

const makeUsefulTransaction = transaction => ({
  activated: transaction.activated,
  description: `Trade ${resourceString(transaction.costs)} for ${resourceString(
    transaction.gains
  )}`,
});

const INCREASE_PRIORITY = 'increasePriority';
const DECREATE_PRIORITY = 'decreasePriority';
const ACTIVATE = 'activateTransaction';

const makeModifyTransaction = (index, change) => {
  switch (change) {
  case INCREASE_PRIORITY:
    return increasePriorityAction({ index, });

  case DECREATE_PRIORITY:
    return decreasePriorityAction({ index, });

  case ACTIVATE:
    return switchTransactionAction({ index, });

  default:
    throw new Error(`Unrecognized transaction switch kind ${change}`);
  }
};

const TransactionOptions = ({ transactions, modifyTransaction, }) => {
  const usefulTransactions = transactions.map(makeUsefulTransaction);

  return (
    <div>
      <h6 className="font-weight-bold">Transaction Precedence</h6>
      <ul>
        {usefulTransactions.map((transaction, tInd) => {
          const { activated, } = transaction;
          return (
            <li key={tInd}>
              <input
                type="checkbox"
                checked={activated}
                onChange={() => modifyTransaction(tInd, ACTIVATE)}
              />
              <button
                onClick={() => modifyTransaction(tInd, INCREASE_PRIORITY)}
              >
                Up
              </button>
              <button
                onClick={() => modifyTransaction(tInd, DECREATE_PRIORITY)}
              >
                Down
              </button>
              {transaction.description}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

TransactionOptions.propTypes = {
  modifyTransaction: PropTypes.func,
};

const mapStateToProps = ({ market, }) => {
  const { transactions, } = market;
  return { transactions, };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ modifyTransaction: makeModifyTransaction, }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionOptions);
