import { fetchUserProjects } from './project'
import { fetchDefaults } from './category'

export function init() {
  return dispatch => {

    //User projects
    dispatch(fetchUserProjects());
    console.log("fetching user projects")

    //Should fetch transactions

    //Default categories
    dispatch(fetchDefaults());
    console.log("fetching default categories")
  }
}

export function showConfirmation(payload) {
  return dispatch => dispatch({type:'SHOW_CONFIRMATION', payload});
}

export function hideConfirmation() {
  return dispatch => dispatch({type:'HIDE_CONFIRMATION'});
}