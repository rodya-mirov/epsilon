import { Cmd, loop, } from 'redux-loop';
import { List, } from 'immutable';

export const MONEY = 'money';
export const SEEDS = 'seeds';
export const LIMES = 'limes';

export const initialState = {
  limes: 0,
  seeds: 40,
  money: 50,
};

const TRY_SPEND_ACTION = 'resources/trySpend';

export const makeTrySpendAction = ({
  cost,
  successAction = undefined,
  failureAction = undefined,
  successActions = [],
  failureActions = [],
}) => {
  let actualSuccessActions = successActions ? List(successActions) : List();
  if (successAction) {
    actualSuccessActions = actualSuccessActions.push(successAction);
  }

  let actualFailureActions = failureActions ? List(failureActions) : List();
  if (failureAction) {
    actualFailureActions = actualFailureActions.push(failureAction);
  }
  return {
    type: TRY_SPEND_ACTION,
    cost,
    successActions: actualSuccessActions,
    failureActions: actualFailureActions,
  };
};

const resolveTrySpend = (state, { cost, successActions, failureActions, }) => {
  const newState = { ...state, };

  for (const resourceType of Object.keys(cost)) {
    if (newState[resourceType] < cost[resourceType]) {
      return loop(state, Cmd.list(failureActions.map(Cmd.action).toJS()));
    }
    newState[resourceType] -= cost[resourceType];
  }

  return loop(newState, Cmd.list(successActions.map(Cmd.action).toJS()));
};

export default (state = initialState, action) => {
  switch (action.type) {
  case TRY_SPEND_ACTION:
    return resolveTrySpend(state, action);

  default:
    return state;
  }
};
