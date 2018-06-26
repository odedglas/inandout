import { combineReducers } from 'redux';
import loading from './loading'
import project from './project'
import authentication from './authentication'
import user from './user'

const appReducer = combineReducers({
  loading,
  project,
  authentication,
  user,
});

export default function (state, action) {

  return appReducer(state, action);
}