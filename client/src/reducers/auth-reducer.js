import _ from 'lodash';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_PROFILE,
  INIT_AUTH,
  EDIT_USER,
  REQUEST_SUCCESS,
  FETCH_MESSAGE
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, successMessage: '', error: '', loginMessage: '', authenticated: true,
        username: action.payload.username, email: action.payload.email,
        firstName: action.payload.firstName, lastName: action.payload.lastName };
    case UNAUTH_USER:
      return { ...state, authenticated: false, username: '', email: '', fistName: '', lastName: '', loginMessage: _.has(action, 'payload.message') ? action.payload.message : '' };
    case FETCH_PROFILE:
      return {...state, user: action.payload.user};
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case REQUEST_SUCCESS:
      return { ...state, error: '', successMessage: action.payload};
    case EDIT_USER:
      return { ...state, error: '', successMessage: action.payload.message,
        firstName: action.payload.firstName, lastName: action.payload.lastName};
    case INIT_AUTH:
      return { ...state, error: '', successMessage: ''};
    case FETCH_MESSAGE:
      return { ...state, message: action.payload };
  }

  return state;
}
