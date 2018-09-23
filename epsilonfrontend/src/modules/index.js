import { combineReducers, } from 'redux';
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

export default (state, action) => {
  const combinedOutput = combined(state, action);
  return update(combinedOutput, action);
};
