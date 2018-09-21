import React from 'react';
import { ConnectedRouter, } from 'connected-react-router';
import store, { history, } from './store';
import App from './containers/app';
import { Provider, } from 'react-redux';
import { render, } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { UPDATE, } from './modules/update';

import './index.css';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);

registerServiceWorker();

const msPerTick = 250;
setInterval(() => store.dispatch({ type: UPDATE, }), msPerTick);
