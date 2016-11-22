import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_PROFILE,
  FETCH_MESSAGE
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, error: '', authenticated: true, username: action.payload.username, email: action.payload.email };
    case UNAUTH_USER:
      return { ...state, authenticated: false, username: '', email: '' };
    case FETCH_PROFILE:
      return {...state, user: action.payload.user};
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case FETCH_MESSAGE:
      return { ...state, message: action.payload };
  }

  return state;
}
