const initialState = {
  actions: [],
  loading: false,
  showConfirmModal: false,
  users: [],
  confirmPayload: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_DASHBOARD_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.users,
      };
    case 'SHOW_CONFIRMATION':
      return {
        ...state,
        showConfirmModal: true,
        confirmPayload: action.payload,
      };
    case 'HIDE_CONFIRMATION':
      return {
        ...state,
        showConfirmModal: false,
      };

    default:
      return state;
  }
}