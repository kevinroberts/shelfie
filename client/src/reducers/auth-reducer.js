import _ from 'lodash'
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_PROFILE,
  EDIT_USER,
  REQUEST_SUCCESS,
  UPDATE_FAVORITE_CLIPS
} from '../actions/types'

const INITIAL_STATE = {
  successMessage: '',
  error: '',
  loginMessage: '',
  username: '',
  email: '',
  firstName: '',
  favoriteClips: [],
  lastName: ''
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        successMessage: '',
        error: '',
        loginMessage: '',
        authenticated: true,
        username: action.payload.username,
        email: action.payload.email,
        favoriteClips: action.payload.favoriteClips,
        firstName: action.payload.firstName,
        isAdmin: action.payload.isAdmin,
        lastName: action.payload.lastName
      }
    case UNAUTH_USER:
      return {
        ...state,
        authenticated: false,
        username: '',
        email: '',
        isAdmin: false,
        fistName: '',
        favoriteClips: [],
        lastName: '',
        loginMessage: _.has(action, 'payload.message') ? action.payload.message : ''
      }
    case FETCH_PROFILE:
      return {...state, user: action.payload.user}
    case UPDATE_FAVORITE_CLIPS:
      return {...state, favoriteClips: action.payload}
    case REQUEST_SUCCESS:
      return {...state}
    case EDIT_USER:
      return {...state, firstName: action.payload.firstName, lastName: action.payload.lastName, user: action.payload}
  }

  return state
}
