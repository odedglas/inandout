export const ROUTER = {
  LOGIN          : '/login',
  SIGN_UP        : '/signup',
  FORGOT_PASSWORD: '/forgot-pw',
  DASHBOARD      : '/dashboard',
  PROJECT        : '/dashboard/project/:identifier',
  BUDGETS        : '/dashboard/project/:identifier/budgets',
  CATEGORIES        : '/dashboard/project/:identifier/categories',
  TRANSACTIONS        : '/dashboard/project/:identifier/transactions',
  CUSTOMERS        : '/dashboard/project/:identifier/customers',
  PROJECT_CALENDAR        : '/dashboard/project/:identifier/calendar',
  TODOS        : '/dashboard/project/:identifier/todos',
  WELCOME        : '/welcome',
  HOME           : '/'
};

export const CURRENCIES = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'NIS',
    label: '₪',
  },
  {
    value: 'JPY',
    label: '¥',
  }
];

export const PROJECT_TYPES = {
  PERSONAL: {
    key: 'personal',
    label: 'Personal',
    description: 'Income / Outcome / Catergories / Budgets / Todo\'s '
  },
  HOUSE_HOLD: {
    key: 'houseHolding',
    label: 'House Holding',
    description: 'Same as above + Sharable / Real time Sync'
  },
  SMALL_BUSINESS: {
    key: 'smallBusiness',
    label: 'Small business',
    description: 'Same as above + Customers / Calendar',
  },
  MEDIUM_BUSINESS: {
    key: 'mediumBusiness',
    label: 'Medium business',
    description: 'Same as above + Shift Manager / Project Management',
  }
};

export const LOCAL_STORAGE = {
  PROJECT_DRAWER_OPEN: 'project-drawer-open',
};