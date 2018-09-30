import { createStore, applyMiddleware, compose, } from 'redux';
import { install, } from 'redux-loop';
import rootReducer from './modules';

const initialState = {};
const middleWare = [];

const composedEnhancers = compose(
  applyMiddleware(...middleWare),
  install()
);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
