import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../components/app';
import Profile from '../components/profile';
import Feature from '../components/feature';
import Library from '../components/library/public-library';
import Signin from '../components/auth/signin';
import Signout from '../components/auth/signout';
import Signup from '../components/auth/signup';
import ResetPassword from '../components/auth/reset-password';
import ResetRequest from '../components/auth/reset-request';
import AddClip from '../components/clip/add-clip';
import ViewClip from '../components/clip/view-clip';
import EditClip from '../components/clip/edit-clip';
import PageNotFound from '../components/page-not-found';
import RequireAuth from '../components/auth/require-auth';

export default(
  <Route path="/" component={App}>
    <IndexRedirect to="/library" />
    <Route path="library" component={Library}>
      <Route path="?sort=:sort&offset=:offset&tags=:activeTag&limit=:limit&title=:title" component={Library} />
    </Route>
    {/*<Route path="mylibrary" component={MyLibrary}>*/}
        {/*<Route path="?sort=:sort&offset=:offset&tags=:activeTag&limit=:limit" component={MyLibrary} />*/}
    {/*</Route>*/}
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
    <Route path="404" component={PageNotFound} />
    <Route path="*" component={PageNotFound} />
  </Route>
);