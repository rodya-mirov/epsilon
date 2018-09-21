import { combineReducers, } from 'redux';
import counter from './counter';
import farm from './farm';
import todo from './todo';

export default combineReducers({
  // this means state.counter is passed to the reducer called counter, "modified",
  // and then pasted back together as "state.counter" in the resulting state,
  // because redux is magic
  counter,
  farm,
  todo,
});
