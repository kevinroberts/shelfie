import {
  SEARCH_MY_CLIPS,
} from '../actions/types';

const INITIAL_STATE = {
  all: [],
  offset: 0,
  currentPage: 1,
  totalPages: 1,
  title: '',
  sort: 'createdAt',
  limit: 20
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_MY_CLIPS:
      return action.payload;
    default:
      return state;
  }
};
