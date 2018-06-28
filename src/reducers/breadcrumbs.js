
export default function (state = [], action) {
  switch (action.type) {
    case 'ADD_CRUMB':
      return [
        ...state,
        action.payload
      ];
    case 'UPDATE_CRUMB':
      return state.map(crumb => {
        return crumb.id === action.payload.id ? action.payload : crumb
      });
    case 'REMOVE_CRUMB':
      return state.filter(crumb => {
        return crumb.id !== action.payload.id
      });
    case 'CLEAR_BREADCRUMBS':
      return [];
    default:
      return state
  }
}