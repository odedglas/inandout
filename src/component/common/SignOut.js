import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import auth from '@service/auth';
import {ROUTER as routes} from '../../constants';

const doLogout = (history) => {
  auth.signOut().then(
    history.push(routes.LOGIN)
  );
};

const SignOutButton = ({history}) =>
  <Button variant="contained"
          onClick={() => doLogout(history)}
          color="primary">
    Sign Out
  </Button>;

export default withRouter(SignOutButton);