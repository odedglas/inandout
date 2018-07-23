import { combineReducers } from 'redux';
import authentication from './authentication'
import user from './user'
import loading from './loading'
import dashboard from './dashboard'
import project from './project'
import projects from './projects'
import categories from './categories'
import breadcrumbs from './breadcrumbs'

const appReducer = combineReducers({
  authentication,
  user,
  loading,
  dashboard,
  projects,
  project,
  categories,
  breadcrumbs,
});

export default function (state, action) {

  return appReducer(state, action);
}