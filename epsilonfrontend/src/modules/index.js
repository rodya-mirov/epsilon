import { combineReducers, reduceReducers, } from 'redux-loop';

import { reducer as toastrReducer, } from 'react-redux-toastr';

import farm, { initialState as farmInitialState, } from './farm';
import market, { initialState as marketInitialState, } from './market';
import resources, { initialState as resourcesInitialState, } from './resources';
import general, { initialState as generalInitialState, } from './general';
import router from './router';
import conversation, {
  initialState as conversationInitialState,
} from './conversation';

import update from './update';
import loadSave from './loadSave';

// I have no idea why this is necessary; it seems like redux-loop doesn't play well
// with a lot of other libraries and you have to manually glue them together
const myToasterReducer = (toastrState, action) => {
  return toastrReducer(toastrState, action);
};

const combined = combineReducers({
  farm,
  market,
  resources,
  general,
  conversation,
  toastr: myToasterReducer,
});

export const fullInitialState = {
  farm: farmInitialState,
  market: marketInitialState,
  resources: resourcesInitialState,
  general: generalInitialState,
  conversation: conversationInitialState,
  toastr: {
    toastrs: [],
    confirm: null,
  },
};

export default reduceReducers(combined, update, loadSave, router);
