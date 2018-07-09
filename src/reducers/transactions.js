const initialState = {
  monthlyMap: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_MONTHLY_TRANSACTIONS':
      return {
        ...state,
        monthlyMap: action.transactions
      };

    default:
      return state;
  }
}