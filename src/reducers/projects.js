import util from '@util/';

export default function (state = [], action) {

  switch (action.type) {
    case 'SET_PROJECTS':
      return action.projects;
    case 'ADD_PROJECT':
      return [
        ...state,
        action.project
      ];

    case 'UPDATE_PROJECT':
      debugger;
      return util.updateById(state, action.project);
    default:
      return state;
  }
}