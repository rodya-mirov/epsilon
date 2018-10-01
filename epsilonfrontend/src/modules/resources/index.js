import { Cmd, loop, } from 'redux-loop';

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
}) => {
  return { type: TRY_SPEND_ACTION, cost, successAction, failureAction, };
};

const resolveTrySpend = (
  state,
  { cost, successAction = undefined, failureAction = undefined, }
) => {
  const newState = { ...state, };

  for (const resourceType of Object.keys(cost)) {
    if (newState[resourceType] < cost[resourceType]) {
      return loop(state, failureAction ? Cmd.action(failureAction) : Cmd.none);
    }
    newState[resourceType] -= cost[resourceType];
  }

  return loop(newState, successAction ? Cmd.action(successAction) : Cmd.none);
};

export default (state = initialState, action) => {
  switch (action.type) {
  case TRY_SPEND_ACTION:
    return resolveTrySpend(state, action);

  default:
    return state;
  }
};
