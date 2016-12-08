import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth-reducer';
import filterCriteriaReducer from './FilterCriteriaReducer';

const rootReducer = combineReducers({
  form: formReducer,
  filterCriteria: filterCriteriaReducer,
  auth: authReducer
});

export default rootReducer;
