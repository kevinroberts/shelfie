import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/lib/createBrowserHistory';

import {ReduxRouter, reduxReactRouter} from 'redux-router';

import reduxThunk from 'redux-thunk';
import LocalStorageUtils from './utils/local-storage-utils';
import routes from './routes';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';
import '../styles/main.scss';


const middleware = applyMiddleware(reduxThunk);

let createStoreWithMiddleware = compose(
  middleware,
  reduxReactRouter({routes, createHistory})
);

const store = createStoreWithMiddleware(createStore)(reducers, window.__INITIAL_STATE__);

const token = LocalStorageUtils.getToken();
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER, payload: LocalStorageUtils.getUser() });
}

ReactDOM.render(
  <Provider store={store}>
    <ReduxRouter>
      {routes}
    </ReduxRouter>
  </Provider>
  , document.getElementById('root'));
