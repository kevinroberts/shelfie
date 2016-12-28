import {
  SEARCH_CLIPS,
  FIND_CLIP,
  REMOVE_CLIP,
  RESET_CLIP
} from '../actions/types';

const INITIAL_STATE = {
  all: [],
  offset: 0,
  currentPage: 1,
  totalPages: 1,
  sort: 'createdAt',
  limit: 20
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CLIPS:
      return action.payload;
    case FIND_CLIP:
      return { ...state, clip: action.payload };
    case RESET_CLIP:
      return { ...state, clip: null };
    case REMOVE_CLIP:
      return {...state, clip: null};
    default:
      return state;
  }
};
