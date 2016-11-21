import axios from 'axios';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import LocalStorageUtils from '../utils/local_storage_utils';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ username, password }) {
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signin`, { username, password })
      .then(response => {
        // If request is good...
        // - Save the JWT token
        LocalStorageUtils.setUser(response);
        // - Update state to indicate user is authenticated
        var payload = {username: username, email: response.data.email};
        dispatch({ type: AUTH_USER,
                    payload: payload });
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(response => {
        // If request is bad...
        // - Show an error to the user
        let responseMessage = 'Bad Login Info';
        if (response.status == 401) {
          responseMessage = 'Incorrect user credentials. Please check your username or password.'
        }
        if (_.has(response, 'data.error')) {
          responseMessage = response.data.error;
        }
        dispatch(authError(responseMessage));
      });
  }
}

export function signupUser({ username, email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { username, email, password })
      .then(response => {
        var payload = {username: username, email: email};
        dispatch({ type: AUTH_USER, payload: payload });
        LocalStorageUtils.setUser(response);
        browserHistory.push('/feature');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  LocalStorageUtils.clearUser();

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: LocalStorageUtils.getToken() }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}
