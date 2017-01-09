import axios from 'axios';
import { push } from 'redux-router';
import { notifyUser } from '../utils/notifications'
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
  SEARCH_MY_CLIPS,
  SET_ACTIVE_TAG,
  FIND_CLIP,
  ADD_UPLOADED_CLIP,
  RESET_UPLOADED,
  UPDATE_FAVORITE_CLIPS,
  REMOVE_CLIP,
  REQUEST_SUCCESS
} from './types';

export const ROOT_URL = '/api';

export function signinUser( response, rememberUser, redirect="/" ) {
  return function(dispatch) {
    // - Save the JWT token
    LocalStorageUtils.setUser(response, rememberUser);
    // - Update state to indicate user is authenticated
    dispatch({ type: AUTH_USER,
      payload: response.data });
    // - redirect to the route '/profile'
    if (redirect === '/') {
      redirect = `/profile/${response.data.username}`
    }
    dispatch(push(redirect));
  };
}

export function signupUser( response ) {
  return function(dispatch) {
        dispatch({ type: AUTH_USER, payload: response.data });
        LocalStorageUtils.setUser(response, false);
        dispatch(push(`/profile/${response.data.username}`));
  };
}


export function editUser(response, passwordChanged) {
  return function (dispatch) {
    if (passwordChanged) {
      LocalStorageUtils.clearUser();
      dispatch({type: UNAUTH_USER, payload: response.data});
      dispatch(push('/signin'));
    } else {
      dispatch({type: EDIT_USER, payload: response.data});
    }
  };
}

export function removeClip(id, title) {
  return function (dispatch) {
    axios({method: 'post',
      url: `${ROOT_URL}/remove-clip`,
      data: {clip: id},
      headers: {authorization : LocalStorageUtils.getToken() } })
      .then(response => {
        notifyUser("Clip removed!", "Your clip \"" + title + "\" was successfully removed.", "/static/img/trash.png");
        dispatch({type: REMOVE_CLIP});
        dispatch({ type: RESET_UPLOADED });
        dispatch(push('/'));
      })
      .catch(response => {
        notifyUser("Error", "Your clip \"" + title + "\" could not be removed.", "/static/img/error.png");
      });
  }
}

export function updateFavoriteClip(clipId, clipTitle, action) {
  return function(dispatch) {
    axios({method: 'post',
      url: `${ROOT_URL}/favorite`,
      data: {clipId: clipId, action: action},
      headers: {authorization : LocalStorageUtils.getToken() } })
      .then(response => {
        let favoriteClips = LocalStorageUtils.getFavoriteClips();

        if (action === 'remove') {
          const index = favoriteClips.indexOf(clipId);
          favoriteClips.splice(index, 1);
          let userObj = LocalStorageUtils.getUser();
          userObj.favoriteClips = favoriteClips;
          LocalStorageUtils.updateUser(userObj);
          dispatch({type: UPDATE_FAVORITE_CLIPS, payload: favoriteClips});
          notifyUser("Favorite removed!", `The clip ${clipTitle} has been removed from your favorites.`, "/static/img/trash.png");

        } else if (action === 'add') {
          favoriteClips.push(clipId);
          dispatch({type: UPDATE_FAVORITE_CLIPS, payload: favoriteClips});
          let userObj = LocalStorageUtils.getUser();
          userObj.favoriteClips = favoriteClips;
          LocalStorageUtils.updateUser(userObj);
          notifyUser("Favorite Added!", `The clip ${clipTitle} has been added to your favorites.`, "/static/img/heart.png");
        }

      })
      .catch(response => {
        notifyUser("Error", response.data._error, "/static/img/error.png");
      });
  }
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
      }).catch(response => {
      dispatch(push('/404'));
    })
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

export function getMyTagList() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/my-tags`, {
      headers: { authorization: LocalStorageUtils.getToken() }
    })
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

export function addUploadedClip(uploadedClip) {
  return { type: ADD_UPLOADED_CLIP, payload: uploadedClip };
}

export function resetUploadedClips() {
  return { type: RESET_UPLOADED };
}

export function searchClips(...criteria) {
  return function(dispatch) {
    dispatch(push(`/library?${Qs.stringify(criteria[0])}`));
    axios.get(`${ROOT_URL}/clips?${Qs.stringify(criteria[0])}`)
      .then(response => {
        dispatch({
          type: SEARCH_CLIPS,
          payload: response.data
        });
      });
  }
}

export function searchMyClips(...criteria) {
  return function(dispatch) {
    dispatch(push(`/my-library?${Qs.stringify(criteria[0])}`));

    axios.get(`${ROOT_URL}/my-clips?${Qs.stringify(criteria[0])}`, {
      headers: { authorization: LocalStorageUtils.getToken() }
    })
      .then(response => {
        dispatch({
          type: SEARCH_MY_CLIPS,
          payload: response.data
        });
      });
  }
}

export function findClip(id) {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/clip?id=${id}`)
      .then(response => {
        dispatch({
          type: FIND_CLIP,
          payload: response.data
        });
      }).catch(function (err) {
      notifyUser("Error", err.data._error, "/static/img/error.png");
      dispatch(push('/404'));
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

