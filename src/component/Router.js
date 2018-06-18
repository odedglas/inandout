import React, {Component} from 'react';

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { asyncComponent } from 'react-async-component';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {ROUTER as routes} from '../constants'

const SignUp = asyncComponent({
  resolve: () => import('./signup')
});
const Login = asyncComponent({
  resolve: () => import('./login')
});
const Dashboard = asyncComponent({
  resolve: () => import('./dashboard/Dashboard')
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

class Router extends Component {

  render() {

    const { isAuthenticated} = this.props;
    return (
      <BrowserRouter>
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Switch location={location}>
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
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </BrowserRouter>
    );
  }
}

export default connect(state => ({
  isAuthenticated: state.authentication.authenticated,
}), {})(Router);