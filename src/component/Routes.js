import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { asyncComponent } from 'react-async-component';
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

const AuthenticatedRoute = ({authenticated, component: Component, ...routeProps}) => (
  <Route {...routeProps} render={(props) => {
    console.log("Trying to acces private route with : " + (authenticated ? 'true' : 'false'));
    return (
      authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: routes.LOGIN,
          state   : {from: props.location}
        }}/>
    )
  }}/>
);

const UnAuthenticatedRoute = ({authenticated, component: Component, ...routeProps}) => (
  <Route {...routeProps} render={(props) => {
    console.log("Trying to acces none authenticated route with : " + (authenticated ? 'true' : 'false'));
    return (
      !authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: routes.DASHBOARD
        }}/>
    )
  }}/>
);

const getRoutes = (isAuthenticated, location) => (

  <Switch location={location}>
    <UnAuthenticatedRoute exact path={routes.SIGN_UP}
                          authenticated={isAuthenticated}
                          component={SignUp}/>

    <UnAuthenticatedRoute exact path={routes.LOGIN}
                          authenticated={isAuthenticated}
                          component={Login}/>

    <AuthenticatedRoute exact path={routes.DASHBOARD}
                        authenticated={isAuthenticated}
                        component={Dashboard}/>

    <Redirect to={isAuthenticated ? routes.DASHBOARD : routes.LOGIN}/>
  </Switch>

);

export {
  AuthenticatedRoute,
  UnAuthenticatedRoute,
  getRoutes
}