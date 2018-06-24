export const ROUTER = {
  LOGIN          : '/login',
  SIGN_UP        : '/signup',
  FORGOT_PASSWORD: '/forgot-pw',
  DASHBOARD      : '/dashboard',
  WELCOME        : '/welcome',
  HOME           : '/'
};

export const PROJECT_TYPES = {
  HOUSE_HOLD: {
    key: 'houseHolding',
    label: 'House Holding',
    description: 'Outcome categories, Todo\'s and budgets'
  },
  SMALL_BUSINESS: {
    key: 'smallBusiness',
    label: 'Small business',
    description: 'Same as above + Customers and Calendar',
  },
  MEDIUM_BUSINESS: {
    key: 'mediumBusiness',
    label: 'Medium business',
    description: 'Same as above + Shift Manager and Project Management',
  }
};