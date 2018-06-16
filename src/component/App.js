import React, {Component} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
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
    debugger;
    console.log("Trying to acces private route with : " + (authenticated ? 'true' : 'false'));
    return (
      authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
    )
  }} />
);

class App extends Component {

  getRoutes = () => {

    const { isAuthenticated, authenticating } = this.props;
    return authenticating ? <Welcome /> :
        <div>
          <Navigation/>

          <hr/>

          <Switch>
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

            <Redirect to='/dashboard' />
          </Switch>
        </div>
  };

  render() {
    return (
      <Router>
          { this.getRoutes() }
      </Router>
    );
  }
}

export default compose(
  withAuthentication,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    authenticating: state.authentication.authenticating,
    currentUser: state.authentication.currentUser
  }), {})
)(App);
