import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {
  Button
} from 'react-onsenui';
import auth from '@service/auth';
import {ROUTER as routes} from '../../constants';

const doLogout = (history) => {
  auth.signOut().then(
    history.push(routes.LOGIN)
  );
};

const SignOutButton = ({ history }) =>
  <Button modifier={'material'}
    type="button"
    onClick={() => doLogout(history)}
  >
    Sign Out
  </Button>;

export default withRouter(SignOutButton);