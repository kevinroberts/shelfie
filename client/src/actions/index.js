import axios from 'axios';
import { browserHistory } from 'react-router';
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
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
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
        if (response.data.error) {
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
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
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
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}
