import { combineReducers, reduceReducers, } from 'redux-loop';

import farm, { initialState as farmInitialState, } from './farm';
import market, { initialState as marketInitialState, } from './market';
import resources, { initialState as resourcesInitialState, } from './resources';
import general, { initialState as generalInitialState, } from './general';
import conversation, {
  initialState as conversationInitialState,
} from './conversation';

import update from './update';
import loadSave from './loadSave';

const combined = combineReducers({
  farm,
  market,
  resources,
  general,
  conversation,
});

export const fullInitialState = {
  farm: farmInitialState,
  market: marketInitialState,
  resources: resourcesInitialState,
  general: generalInitialState,
  conversation: conversationInitialState,
};

export default reduceReducers(combined, update, loadSave);
