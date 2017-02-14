import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {routerStateReducer} from 'redux-router'
import authReducer from './auth-reducer'
import ClipReducer from './ClipReducer'
import MyClipReducer from './MyClipReducer'
import MyFavoritesReducer from './MyFavoritesReducer'
import FilterCriteriaReducer from './FilterCriteriaReducer'
import UploadedReducer from './uploaded-reducer'
import { audioReducer as audio } from 'redux-audio'
import {reducer as notifications} from 'react-notification-system-redux'

const rootReducer = combineReducers({
  form: formReducer,
  clips: ClipReducer,
  myClips: MyClipReducer,
  myFavorites: MyFavoritesReducer,
  filterCriteria: FilterCriteriaReducer,
  audio,
  uploaded: UploadedReducer,
  auth: authReducer,
  router: routerStateReducer,
  notifications
})

export default rootReducer
