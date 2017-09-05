import axios from 'axios'
import { push } from 'redux-router'
import LocalStorageUtils from '../utils/local-storage-utils'
import Notifications from 'react-notification-system-redux'
import Qs from 'qs'
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_PROFILE,
  EDIT_USER,
  SET_TAG_LIST,
  SEARCH_CLIPS,
  SEARCH_MY_CLIPS,
  SEARCH_FAVORITE_CLIPS,
  SET_ACTIVE_TAG,
  FIND_CLIP,
  ADD_UPLOADED_CLIP,
  RESET_UPLOADED,
  LOAD_SETTINGS,
  UPDATE_FAVORITE_CLIPS,
  REMOVE_CLIP,
  UPDATE_CLIPS,
  REQUEST_SUCCESS
} from './types'

export const ROOT_URL = process.env.NODE_ENV !== 'production' ? '/api' : ''

export function signinUser (response, rememberUser, redirect = '/') {
  return function (dispatch) {
    // - Save the JWT token
    LocalStorageUtils.setUser(response, rememberUser)
    // - Update state to indicate user is authenticated
    dispatch({
      type: AUTH_USER,
      payload: response.data
    })
    // - redirect to the route '/profile'
    if (redirect === '/') {
      redirect = `/profile/${response.data.username}`
    }
    dispatch(push(redirect))
  }
}

export function signupUser (response) {
  return function (dispatch) {
    dispatch({type: AUTH_USER, payload: response.data})
    LocalStorageUtils.setUser(response, false)
    dispatch(push(`/profile/${response.data.username}`))
  }
}

export function editUser (response, passwordChanged) {
  return function (dispatch) {
    if (passwordChanged) {
      LocalStorageUtils.clearUser()
      dispatch({type: UNAUTH_USER, payload: response.data})
      dispatch(push('/signin'))
    } else {
      dispatch({type: EDIT_USER, payload: response.data})
    }
  }
}

/* updateClips
 *  Accepts a newly updated clip and updates the reducer state with the new clip details
 */
export function updateClips (updatedClip) {
  return function (dispatch) {
    dispatch({type: UPDATE_CLIPS, payload: updatedClip})
  }
}

export function removeClip (id, title) {
  return function (dispatch) {
    axios({
      method: 'post',
      url: `${ROOT_URL}/remove-clip`,
      data: {clip: id},
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        const notificationOpts = {
          title: 'Clip removed!',
          message: `Your clip '${title}' was successfully removed.`,
          position: 'tr',
          autoDismiss: 3
        }
        dispatch(Notifications.success(notificationOpts))
        dispatch({type: REMOVE_CLIP})
        dispatch({type: RESET_UPLOADED})
        dispatch(push('/'))
      })
      .catch(response => {
        if (response.status === 401) {
          // user is un-authorized to perform this action, push to login page
          LocalStorageUtils.clearUser()
          dispatch({type: UNAUTH_USER})
          dispatch(push('/signin'))
        } else {
          const notificationOpts = {
            title: 'Error occurred',
            message: `Your clip '${title}' could not be removed.`,
            position: 'tr',
            autoDismiss: 5
          }
          dispatch(Notifications.error(notificationOpts))
        }
      })
  }
}

export function updateFavoriteClip (clipId, clipTitle, action) {
  return function (dispatch) {
    axios({
      method: 'post',
      url: `${ROOT_URL}/favorite`,
      data: {clipId: clipId, action: action},
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        let favoriteClips = LocalStorageUtils.getFavoriteClips()

        if (action === 'remove') {
          const index = favoriteClips.indexOf(clipId)
          favoriteClips.splice(index, 1)
          let userObj = LocalStorageUtils.getUser()
          userObj.favoriteClips = favoriteClips
          LocalStorageUtils.updateUser(userObj)
          dispatch({type: UPDATE_FAVORITE_CLIPS, payload: favoriteClips})
          const notificationOpts = {
            title: 'Favorite removed',
            message: `The clip ${clipTitle} has been removed from your favorites.`,
            position: 'tr',
            autoDismiss: 3
          }
          dispatch(Notifications.success(notificationOpts))
        } else if (action === 'add') {
          favoriteClips.push(clipId)
          dispatch({type: UPDATE_FAVORITE_CLIPS, payload: favoriteClips})
          let userObj = LocalStorageUtils.getUser()
          userObj.favoriteClips = favoriteClips
          LocalStorageUtils.updateUser(userObj)
          const notificationOpts = {
            title: 'Favorite Added!',
            message: `The clip ${clipTitle} has been added to your favorites.`,
            position: 'tr',
            autoDismiss: 3
          }
          dispatch(Notifications.success(notificationOpts))
        }
      })
      .catch(response => {
        if (response.status === 401) {
          // user is un-authorized to perform this action, push to login page
          LocalStorageUtils.clearUser()
          dispatch({type: UNAUTH_USER})
          dispatch(push('/signin'))
        } else {
          const notificationOpts = {
            title: 'Error...',
            message: response.data._error,
            position: 'tr',
            autoDismiss: 5
          }
          dispatch(Notifications.error(notificationOpts))
        }
      })
  }
}

export function sendResetRequest (response) {
  return function (dispatch) {
    dispatch({type: REQUEST_SUCCESS, payload: response.data.message})
  }
}

export function sendPasswordReset (response) {
  return function (dispatch) {
    dispatch({type: REQUEST_SUCCESS, payload: response.data.message})
  }
}

export function fetchProfile (username) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/profile?username=${username}`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: FETCH_PROFILE,
          payload: response.data
        })
      }).catch(response => {
        dispatch(push('/404'))
      }).catch(response => {
        if (response.status === 401) {
          // dispatch to login
          const notificationOpts = {
            title: 'Profile fetch failed',
            message: 'Your login session has expired. Please login again.',
            position: 'tr',
            autoDismiss: 5
          }
          dispatch(Notifications.error(notificationOpts))
          LocalStorageUtils.clearUser()
          dispatch({type: UNAUTH_USER})
          dispatch(push('/signin'))
        }
      })
  }
}

export function signoutUser () {
  LocalStorageUtils.clearUser()

  return {type: UNAUTH_USER}
}

export function getTagList () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/tags`)
      .then(response => {
        dispatch({
          type: SET_TAG_LIST,
          payload: response.data.all
        })
      })
  }
}

export function getMyTagList () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/my-tags`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: SET_TAG_LIST,
          payload: response.data.all
        })
      }).catch(response => {
        if (response.status === 401) {
          // dispatch to login
          const notificationOpts = {
            title: 'Login expired: fetching tags',
            message: 'Your login session has expired. Please login again.',
            position: 'tr',
            autoDismiss: 10
          }
          dispatch(Notifications.error(notificationOpts))
          LocalStorageUtils.clearUser()
          dispatch({type: UNAUTH_USER})
          dispatch(push('/signin'))
        }
      })
  }
}

export function getFavoritesTagList () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/favorite-tags`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: SET_TAG_LIST,
          payload: response.data.all
        })
      }).catch(response => {
      if (response.status === 401) {
        // dispatch to login
        const notificationOpts = {
          title: 'Login expired',
          message: 'Your login session has expired. Please login again.',
          position: 'tr',
          autoDismiss: 10
        }
        dispatch(Notifications.error(notificationOpts))
        LocalStorageUtils.clearUser()
        dispatch({type: UNAUTH_USER})
        dispatch(push('/signin'))
      }
    })
  }
}

export function setActiveTag (tag) {
  return {type: SET_ACTIVE_TAG, payload: tag}
}

export function addUploadedClip (uploadedClip) {
  return {type: ADD_UPLOADED_CLIP, payload: uploadedClip}
}

export function resetUploadedClips () {
  return {type: RESET_UPLOADED}
}

export function searchClips (...criteria) {
  return function (dispatch) {
    dispatch(push(`/library?${Qs.stringify(criteria[0])}`))
    axios.get(`${ROOT_URL}/clips?${Qs.stringify(criteria[0])}`)
      .then(response => {
        dispatch({
          type: SEARCH_CLIPS,
          payload: response.data
        })
      })
  }
}

export function searchMyClips (...criteria) {
  return function (dispatch) {
    dispatch(push(`/my-library?${Qs.stringify(criteria[0])}`))

    axios.get(`${ROOT_URL}/my-clips?${Qs.stringify(criteria[0])}`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: SEARCH_MY_CLIPS,
          payload: response.data
        })
      }).catch(response => {
      if (response.status === 401) {
        // dispatch to login
        const notificationOpts = {
          title: 'Login expired',
          message: 'Your login session has expired. Please login again.',
          position: 'tr',
          autoDismiss: 10
        }
        dispatch(Notifications.error(notificationOpts))
        LocalStorageUtils.clearUser()
        dispatch({type: UNAUTH_USER})
        dispatch(push('/signin'))
      }
    })
  }
}

export function searchMyFavorites (...criteria) {
  return function (dispatch) {
    dispatch(push(`/my-favorites?${Qs.stringify(criteria[0])}`))

    axios.get(`${ROOT_URL}/favorite-clips?${Qs.stringify(criteria[0])}`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: SEARCH_FAVORITE_CLIPS,
          payload: response.data
        })
      }).catch(response => {
      if (response.status === 401) {
        // dispatch to login
        const notificationOpts = {
          title: 'Login expired',
          message: 'Your login session has expired. Please login again.',
          position: 'tr',
          autoDismiss: 10
        }
        dispatch(Notifications.error(notificationOpts))
        LocalStorageUtils.clearUser()
        dispatch({type: UNAUTH_USER})
        dispatch(push('/signin'))
      }
    })
  }
}

export function findClip (id) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/clip?id=${id}`)
      .then(response => {
        dispatch({
          type: FIND_CLIP,
          payload: response.data
        })
      }).catch(function (err) {
        const notificationOpts = {
          title: 'Error...',
          message: err.data._error,
          position: 'tr',
          autoDismiss: 10
        }
        dispatch(Notifications.error(notificationOpts))
        dispatch(push('/404'))
      })
  }
}

export function fetchSiteSettings () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/settings`, {
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    })
      .then(response => {
        dispatch({
          type: LOAD_SETTINGS,
          payload: response.data
        })
      }).catch(response => {
      if (response.status === 401) {
        // dispatch to login
        const notificationOpts = {
          title: 'Login expired',
          message: 'Your login session has expired. Please login again.',
          position: 'tr',
          autoDismiss: 10
        }
        dispatch(Notifications.error(notificationOpts))
        LocalStorageUtils.clearUser()
        dispatch({type: UNAUTH_USER})
        dispatch(push('/signin'))
      }
    })
  }
}
