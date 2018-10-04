import { Cmd, loop, } from 'redux-loop';
import { browserHistory, } from '../store';

const UPDATE_ROUTER_ACTION = 'router/action';

const PUSH = 'push';

export const push = path => ({
  type: UPDATE_ROUTER_ACTION,
  kind: PUSH,
  path,
});

const reduceRouter = (state, action) => {
  switch (action.kind) {
  case PUSH:
    return loop(state, Cmd.run(() => browserHistory.push(action.path)));

  default:
    throw new Error(`Unsupported router kind ${action.kind}`);
  }
};

export default (state, action) => {
  switch (action.type) {
  case UPDATE_ROUTER_ACTION:
    return reduceRouter(state, action);

  default:
    return state;
  }
};
