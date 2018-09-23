import { combineReducers, reduceReducers, } from 'redux-loop';
import farm, { initialState as farmInitialState, } from './farm';
import resources, { initialState as resourcesInitialState, } from './resources';
import update from './update';

const combined = combineReducers({
  farm,
  resources,
});

export const fullInitialState = {
  farm: farmInitialState,
  resources: resourcesInitialState,
};

export default reduceReducers(combined, update);
