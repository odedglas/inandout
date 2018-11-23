const dev = {
  apiKey: "AIzaSyBp8WpchY6AfA6J7T8Rhg2jjGU7R8qreeY",
  authDomain: "inandout-91d34.firebaseapp.com",
  databaseURL: "https://inandout-91d34.firebaseio.com",
  projectId: "inandout-91d34",
  storageBucket: "inandout-91d34.appspot.com",
  messagingSenderId: "199706605651",
  apiUrl: "https://us-central1-inandout-91d34.cloudfunctions.net/app/",
};

const prod = {
  apiKey: "AIzaSyBp8WpchY6AfA6J7T8Rhg2jjGU7R8qreeY",
  authDomain: "inandout-91d34.firebaseapp.com",
  databaseURL: "https://inandout-91d34.firebaseio.com",
  projectId: "inandout-91d34",
  storageBucket: "inandout-91d34.appspot.com",
  messagingSenderId: "199706605651",
  apiUrl: "https://us-central1-inandout-91d34.cloudfunctions.net/app/",
};

export const config = process.env.NODE_ENV === 'production'
  ? prod
  : dev;

