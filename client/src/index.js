import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import LocalStorageUtils from './utils/local-storage-utils';

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import ResetPassword from './components/auth/reset-password';
import ResetRequest from './components/auth/reset-request';
import Feature from './components/feature';
import Profile from './components/profile';
import AddClip from './components/clip/add-clip';
import ViewClip from './components/clip/view-clip';
import EditClip from './components/clip/edit-clip';
import RequireAuth from './components/auth/require-auth';
import Library from './components/library/public-library';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';
import '../styles/main.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = LocalStorageUtils.getToken();
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER, payload: LocalStorageUtils.getUser() });
}

Notification.requestPermission().then(function(result) {
  console.log(result);
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/library" />
        <Route path="library" component={Library}>
          <Route path="?sort=:sort&page=:page&tags=:activeTag" component={Library} />
        </Route>
        <Route path="signin" component={Signin} />
        <Route path="signout" component={Signout} />
        <Route path="signup" component={Signup} />
        <Route path="profile/:username" component={RequireAuth(Profile)} />
        <Route path="clip/:id" component={ViewClip} />
        <Route path="clip/:id/edit" component={EditClip} />
        <Route path="resetPassword/:key" component={ResetPassword} />
        <Route path="resetRequest" component={ResetRequest} />
        <Route path="add-clip" component={RequireAuth(AddClip)} />
        <Route path="feature" component={RequireAuth(Feature)} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('#mainApp'));
