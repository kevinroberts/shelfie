import axios from 'axios';
import { browserHistory } from 'react-router';
import LocalStorageUtils from '../utils/local-storage-utils';
import Qs from 'Qs';
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_MESSAGE,
  FETCH_PROFILE,
  EDIT_USER,
  SET_TAG_LIST,
  SEARCH_CLIPS,
  SET_ACTIVE_TAG,
  REQUEST_SUCCESS
} from './types';

export const ROOT_URL = '/api';

export function signinUser( response ) {
  return function(dispatch) {
    // - Save the JWT token
    LocalStorageUtils.setUser(response);
    // - Update state to indicate user is authenticated
    dispatch({ type: AUTH_USER,
      payload: response.data });
    // - redirect to the route '/feature'
    browserHistory.push('/feature');
  };
}

export function signupUser( response ) {
  return function(dispatch) {
        dispatch({ type: AUTH_USER, payload: response.data });
        LocalStorageUtils.setUser(response);
        browserHistory.push('/feature');
  };
}


export function editUser(response, passwordChanged) {
  return function (dispatch) {
    if (passwordChanged) {
      LocalStorageUtils.clearUser();
      dispatch({type: UNAUTH_USER, payload: response.data});
      browserHistory.push('/signin');
    } else {
      dispatch({type: EDIT_USER, payload: response.data});
    }
  };
}

export function sendResetRequest(response) {
  return function (dispatch) {
    dispatch({ type: REQUEST_SUCCESS, payload: response.data.message });
  };
}

export function sendPasswordReset(response) {
  return function (dispatch) {
    dispatch({ type: REQUEST_SUCCESS, payload: response.data.message });
  };
}

export function fetchProfile ( username ) {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/profile?username=${username}`, {
      headers: { authorization: LocalStorageUtils.getToken() }
    })
      .then(response => {
        dispatch({
          type: FETCH_PROFILE,
          payload: response.data
        });
      });
  };
}

export function signoutUser() {
  LocalStorageUtils.clearUser();

  return { type: UNAUTH_USER };
}

export function getTagList() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/tags`)
      .then(response => {
        dispatch({
          type: SET_TAG_LIST,
          payload: response.data.all
        });
      });
  }
}

export function setActiveTag(tag) {

  return { type: SET_ACTIVE_TAG, payload: tag };
}

export function searchClips(...criteria) {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/clips?${Qs.stringify(criteria[0])}`)
      .then(response => {
        dispatch({
          type: SEARCH_CLIPS,
          payload: response.data
        });
      });
  }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/message`, {
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

