import React, {Component} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {ROUTER as routes} from '../constants';
import Navigation from './common/Navigation';
import Welcome from './Welcome';
import SignUp from './signup';
import Login from './login';
import Dashboard from './dashboard/Dashboard';

import withAuthentication from './hoc/withAuthentication';

require('react-onsenui');

const PrivateRoute = ({ authenticated, component: Component, ...routeProps }) => (
  <Route {...routeProps} render={(props) => {
    console.log("Trying to acces private route with : " + (authenticated ? 'true' : 'false'));
    return (
      authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/login',
          state: { from: props.location.pathname }
        }} />
    )
  }} />
);

class App extends Component {

  render() {

    const { isAuthenticated } = this.props;

    return (
      <Router>
        <div>
          <Navigation/>

          <hr/>

          <Route
            exact path={routes.WELCOME}
            component={() => <Welcome/>}
          />

          <Route
            exact path={routes.SIGN_UP}
            component={() => <SignUp/>}
          />

          <Route
            exact path={routes.LOGIN}
            component={(props) => <Login {...props} />}
          />

          <PrivateRoute exact path={routes.DASHBOARD}
                        authenticated={isAuthenticated}
                        component={() => <Dashboard/> }/>
        </div>
      </Router>
    );
  }
}

export default compose(
  withAuthentication,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    currentUser: state.authentication.currentUser
  }), {})
)(App);
