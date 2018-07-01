const initialState = {
  actions: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'ADD_DASHBOARD_LOADING':
      return {
        ...state,
        actions:[...state.loading, action.loadKey],
        loading:true,
      };
    case 'REMOVE_DASHBOARD_LOADING':
      let filtered = state.actions.filter( v => v !== action.loadKey);
      return {
        ...state,
        actions: filtered,
        loading: filtered.length > 0,
      };

    default:
      return state;
  }
}