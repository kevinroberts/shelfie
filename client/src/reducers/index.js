import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {routerStateReducer} from 'redux-router';
import authReducer from './auth-reducer';
import ClipReducer from './ClipReducer';
import MyClipReducer from './MyClipReducer';
import FilterCriteriaReducer from './FilterCriteriaReducer';
import UploadedReducer from './uploaded-reducer';
import { audioReducer as audio } from 'redux-audio'

const rootReducer = combineReducers({
  form: formReducer,
  clips: ClipReducer,
  myClips: MyClipReducer,
  filterCriteria: FilterCriteriaReducer,
  audio,
  uploaded: UploadedReducer,
  auth: authReducer,
  router: routerStateReducer
});

export default rootReducer;
