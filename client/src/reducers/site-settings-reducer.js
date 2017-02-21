import {
  LOAD_SETTINGS
} from '../actions/types'

export default (state = { settings: { } }, action) => {
  switch (action.type) {
    case LOAD_SETTINGS:
      return {
        settings: action.payload
      }
    default:
      return state
  }
}
