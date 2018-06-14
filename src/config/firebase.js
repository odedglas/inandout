const dev = {
  apiKey           : "",
  authDomain       : "",
  databaseURL      : "",
  projectId        : "",
  storageBucket    : "",
  messagingSenderId: ""
};

const prod = {
  apiKey           : '',
  authDomain       : '',
  databaseURL      : '',
  projectId        : '',
  storageBucket    : '',
  messagingSenderId: '',
};

export const config = process.env.NODE_ENV === 'production'
  ? prod
  : dev;

