import { combineReducers } from 'redux';
import loading from './loading'
import authentication from './authentication'
import user from './user'

const appReducer = combineReducers({
  loading,
  authentication,
  user,
});

export default function (state, action) {

  return appReducer(state, action);
}