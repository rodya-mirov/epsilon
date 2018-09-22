import { combineReducers, } from 'redux-loop';
import counter from './counter';
import farm from './farm';
import resources from './resources';

export default combineReducers({
  // this means state.counter is passed to the reducer called counter, "modified",
  // and then pasted back together as "state.counter" in the resulting state,
  // because redux is magic
  counter,
  farm,
  resources,
});
