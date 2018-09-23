import React from 'react';
import store from './store';
import App from './containers/app';
import { Provider, } from 'react-redux';
import { render, } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { updateAction, } from './modules/update';

import './index.css';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  target
);

registerServiceWorker();

const msPerTick = 350;
setInterval(() => store.dispatch(updateAction()), msPerTick);
