
export default function (state = [], action) {

  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.notifications;
    case 'ADD_NOTIFICATION':
      return [
        ...state,
        action.notification
      ];
    default:
      return state;
  }
}