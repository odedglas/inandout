import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm'
import {ROUTER as routes} from '../../constants';

const SignUpPage = () =>
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>;

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>;

export default SignUpPage;

export {
  SignUpForm,
  SignUpLink,
};