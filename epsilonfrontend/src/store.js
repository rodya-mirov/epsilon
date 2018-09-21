import { createStore, applyMiddleware, compose, } from 'redux';
import { connectRouter, routerMiddleware, } from 'connected-react-router';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import rootReducer from './modules';

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleWare = [thunk, routerMiddleware(history),];

const composedEnhancers = compose(
  applyMiddleware(...middleWare),
  ...enhancers
);

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers
);

export default store;
