import React, {Component} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { asyncComponent } from 'react-async-component';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {ROUTER as routes} from '../constants'
import Navigation from './common/Navigation';
import LoadingMask from './common/LoadingMask';

import withAuthentication from './hoc/withAuthentication';

require('react-onsenui');


const SignUp = asyncComponent({
  resolve: () => import('./signup')
});
const Login = asyncComponent({
  resolve: () => import('./login')
});
const Dashboard = asyncComponent({
  resolve: () => import('./dashboard/Dashboard')
});
const Welcome = asyncComponent({
  resolve: () => import('./Welcome')
});

const PrivateRoute = ({ authenticated, component: Component, ...routeProps }) => (
  <Route {...routeProps} render={(props) => {
    console.log("Trying to acces private route with : " + (authenticated ? 'true' : 'false'));
    return (
      authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: routes.LOGIN,
          state: { from: props.location }
        }} />
    )
  }} />
);

class App extends Component {

  getRoutes = () => {

    const { isAuthenticated} = this.props;
    console.log("App rendering routes")
    return (
        <Switch >
          <Route
            exact path={routes.SIGN_UP}
            component={SignUp}
          />

          <Route
            exact path={routes.LOGIN}
            component={Login}
          />

          <PrivateRoute exact path={routes.DASHBOARD}
                        authenticated={isAuthenticated}
                        component={Dashboard}/>

          <Redirect to={isAuthenticated ? routes.DASHBOARD : routes.LOGIN} />
        </Switch>
    )
  };

  render() {

    const { authenticating, loading} = this.props;
    return (
      <Router>
        {  authenticating ? <Welcome /> :
          <LoadingMask loading={loading}>
            <div className={'col-flex h-100'}>
              <Navigation/>
              {this.getRoutes() }
              <hr/>
            </div>
          </LoadingMask>
        }
      </Router>
    );
  }
}

export default compose(
  withAuthentication,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    authenticating: state.authentication.authenticating,
    currentUser: state.authentication.currentUser,
    loading: state.loading.isLoading,
  }), {})
)(App);
