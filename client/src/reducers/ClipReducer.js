import _ from 'lodash'
import {
  SEARCH_CLIPS,
  FIND_CLIP,
  REMOVE_CLIP,
  UPDATE_CLIPS,
  RESET_CLIP
} from '../actions/types'

const INITIAL_STATE = {
  all: [],
  offset: 0,
  currentPage: 1,
  totalPages: 1,
  title: '',
  sort: 'createdAt',
  limit: 20
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CLIPS:
      return action.payload
    case FIND_CLIP:
      return { ...state, clip: action.payload }
    case RESET_CLIP:
      return { ...state, clip: null }
    case REMOVE_CLIP:
      return {...state, clip: null}
    case UPDATE_CLIPS:
      let updatedClipState = state.all.map((clip) => {
        if (clip._id === action.payload._id) {
          return action.payload
        } else {
          return clip
        }
      })
      state.all = updatedClipState
      return state
    default:
      return state
  }
}
