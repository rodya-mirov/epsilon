import { Cmd, loop, } from 'redux-loop';
import { browserHistory, } from '../store';

const UPDATE_ROUTER_ACTION = 'router/action';

const PUSH = 'push';
const BACK = 'back';

export const push = path => ({
  type: UPDATE_ROUTER_ACTION,
  kind: PUSH,
  path,
});

export const goBack = () => ({
  type: UPDATE_ROUTER_ACTION,
  kind: BACK,
});

const reduceRouter = (state, action) => {
  switch (action.kind) {
  case PUSH:
    return loop(state, Cmd.run(() => browserHistory.push(action.path)));

  case BACK:
    return loop(state, Cmd.run(() => browserHistory.goBack()));

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
