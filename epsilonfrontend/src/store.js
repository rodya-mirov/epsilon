import { createStore, applyMiddleware, compose, } from 'redux';
import thunk from 'redux-thunk';
import { install, } from 'redux-loop';
import rootReducer from './modules';

const initialState = {};
const middleWare = [thunk,];

const composedEnhancers = compose(
  applyMiddleware(...middleWare),
  install()
);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
