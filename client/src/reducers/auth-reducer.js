import _ from 'lodash';
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_PROFILE,
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
    case REQUEST_SUCCESS:
      return { ...state };
    case EDIT_USER:
      return { ...state, firstName: action.payload.firstName, lastName: action.payload.lastName, user: action.payload};
    case FETCH_MESSAGE:
      return { ...state, message: action.payload };
  }

  return state;
}
