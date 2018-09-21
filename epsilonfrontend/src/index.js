import React from 'react';
import { ConnectedRouter, } from 'connected-react-router';
import store, { history, } from './store';
import App from './containers/app';
import { Provider, } from 'react-redux';
import { render, } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

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
