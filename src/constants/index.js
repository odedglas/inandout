export const ROUTER = {
  LOGIN          : '/login',
  SIGN_UP        : '/signup',
  FORGOT_PASSWORD: '/forgot-pw',
  DASHBOARD      : '/dashboard',
  PROJECT        : '/dashboard/project/:projectName',
  WELCOME        : '/welcome',
  HOME           : '/'
};

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