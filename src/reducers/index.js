import { combineReducers } from 'redux';
import authentication from './authentication'
import user from './user'
import loading from './loading'
import dashboard from './dashboard'
import project from './project'
import category from './category'
import breadcrumbs from './breadcrumbs'

const appReducer = combineReducers({
  authentication,
  user,
  loading,
  dashboard,
  project,
  category,
  breadcrumbs,
});

export default function (state, action) {

  return appReducer(state, action);
}