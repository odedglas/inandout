import { fetchUserProjects } from './project'
import { fetchDefaults } from './category'

export function init() {
  return dispatch => {

    //User projects
    dispatch(fetchUserProjects());
    console.log("fetching user projects")
    //Default categories
    dispatch(fetchDefaults());
    console.log("fetching default categories")
  }
}