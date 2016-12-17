import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth-reducer';
import ClipReducer from './ClipReducer';
import FilterCriteriaReducer from './FilterCriteriaReducer';
import UploadedReducer from './uploaded-reducer';
import { audioReducer as audio } from 'redux-audio'

const rootReducer = combineReducers({
  form: formReducer,
  clips: ClipReducer,
  filterCriteria: FilterCriteriaReducer,
  audio,
  uploaded: UploadedReducer,
  auth: authReducer
});

export default rootReducer;
