export const ROUTER = {
  LOGIN: '/login',
  SIGN_UP: '/signup',
  FORGOT_PASSWORD: '/forgot-pw',
  DASHBOARD: '/dashboard',
  PROJECT: '/dashboard/project/:identifier',
  BUDGETS: '/dashboard/project/:identifier/budgets',
  CATEGORIES: '/dashboard/project/:identifier/categories',
  TRANSACTIONS: '/dashboard/project/:identifier/transactions',
  CUSTOMERS: '/dashboard/project/:identifier/customers',
  PROJECT_CALENDAR: '/dashboard/project/:identifier/calendar',
  WELCOME: '/welcome',
  HOME: '/'
};

export const CURRENCIES = [
  {
    key: 'USD',
    label: '$',
  },
  {
    key: 'EUR',
    label: '€',
  },
  {
    key: 'NIS',
    label: '₪',
  },
  {
    key: 'JPY',
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

export const TRANSACTIONS_DATE_KEY_FORMAT = 'MMYY';

export const TRANSACTIONS = {
  TYPES: {
    INCOME: 'income',
    OUTCOME: 'outcome'
  },
  RECURRING: {
    ONCE: 'once',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
  }
};

export const BUDGETS_PERIOD = [
  {
    key: 'WEEKLY',
    label: 'Weekly',
    period: 'week',
    statisticsPeriod: 'daily',
  },
  {
    key: 'MONTHLY',
    label: 'Monthly',
    period: 'month',
    statisticsPeriod: 'daily',
  },
  {
    key: 'YEARLY',
    label: 'Yearly',
    period: 'year',
    statisticsPeriod: 'monthly',
  },
];

export const TRANSACTIONS_TYPE = [
  {
    key: 'INCOME',
    label: 'Income'
  },
  {
    key: 'OUTCOME',
    label: 'Outcome'
  }
];

export const EVENT_TYPE = [
  {
    key: 'EVENT',
    label: 'Event',
    icon: 'calendar'
  },
  {
    key: 'TASK',
    label: 'Task',
    icon: 'task'
  }
];