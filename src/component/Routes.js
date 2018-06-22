import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {asyncComponent} from 'react-async-component';
//import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {ROUTER as routes} from '../constants'


const SignUp = asyncComponent({
  resolve: () => import('./signup/SignUp')
});
const Login = asyncComponent({
  resolve: () => import('./login/Login')
});
const Dashboard = asyncComponent({
  resolve: () => import('./dashboard/Dashboard')
});

const AuthenticatedRoute = ({authenticated, component: Component, ...routeProps}) => {
  return (
    <Route {...routeProps} render={(props) => {
      console.log("Trying to acces private route with : " + (authenticated ? 'true' : 'false') + ", path is : ");
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
};

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

const getRoutes = (isAuthenticated, location) => {
  console.log(`App rendering, Authenticated: ${isAuthenticated}`);
  return (
    <Switch>
      <Route exact path={routes.SIGN_UP}
             component={SignUp}/>

      <UnAuthenticatedRoute exact path={routes.LOGIN}
                            authenticated={isAuthenticated}
                            component={Login}/>

      <AuthenticatedRoute exact path={routes.DASHBOARD}
                          authenticated={isAuthenticated}
                          location={location}
                          component={Dashboard}/>

      <Redirect to={isAuthenticated ? routes.DASHBOARD : routes.LOGIN}/>
    </Switch>
  );
};

export {
  AuthenticatedRoute,
  UnAuthenticatedRoute,
  getRoutes
}