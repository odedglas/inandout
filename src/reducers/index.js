import { combineReducers } from 'redux';
import authentication from './authentication'
import user from './user'
import loading from './loading'
import project from './project'
import breadcrumbs from './breadcrumbs'

const appReducer = combineReducers({
  authentication,
  user,
  loading,
  project,
  breadcrumbs,
});

export default function (state, action) {

  return appReducer(state, action);
}