import React from 'react';
import {Link} from 'react-router-dom';
import {ROUTER as routes} from '../../constants/index';
import SignOutButton from './SignOut';

const Navigation = () =>
  <div>
    <ul>
      <li><Link to={routes.LOGIN}>Log In</Link></li>
      <li><Link to={routes.DASHBOARD}>Dashboard</Link></li>
      <li><Link to={routes.SIGN_UP}>Sign Up</Link></li>
    </ul>
    <li><SignOutButton /></li>
  </div>;

export default Navigation;

