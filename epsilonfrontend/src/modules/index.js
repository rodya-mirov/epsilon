import { combineReducers, reduceReducers, } from 'redux-loop';

import farm, { initialState as farmInitialState, } from './farm';
import market, { initialState as marketInitialState, } from './market';
import resources, { initialState as resourcesInitialState, } from './resources';
import ticks, { initialState as ticksInitialState, } from './ticks';

import update from './update';

const combined = combineReducers({
  farm,
  market,
  resources,
  ticks,
});

export const fullInitialState = {
  farm: farmInitialState,
  market: marketInitialState,
  resources: resourcesInitialState,
  ticks: ticksInitialState,
};

export default reduceReducers(combined, update);
