import React from 'react';
import {SignUpLink} from '../signup';
import LoginForm from './LoginForm';

const LoginPage = ({ history, location }) => {
  const from = location.state && location.state.from;
  return (
    <div>
      <h1>Login</h1>
      <LoginForm history={history} from={from} />
      <SignUpLink />
    </div>
  );
};


export default LoginPage;

export {
  LoginForm,
};