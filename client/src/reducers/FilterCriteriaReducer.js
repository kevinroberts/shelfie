import {
  SET_TAG_LIST,
} from '../actions/types';

const INITIAL_STATE = {
  tags: [     {
    "_id": "5847296327d195813f1ef249",
    "updatedAt": "2016-12-06T21:10:59.251Z",
    "name": "Movies",
    "_creator": "584721b256f191157961981e",
    "clips": [],
    "createdAt": "2016-12-06T21:10:59.251Z"
  }]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_TAG_LIST:
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};