import { combineReducers } from 'redux';
import loading from './loading'
import authentication from './authentication'

const appReducer = combineReducers({
  loading,
  authentication
});

export default function (state, action) {

  return appReducer(state, action);
}