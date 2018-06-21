import React from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import {ROUTER as routes} from '../../constants';
import Header from './Header';
import Landing from './Landing';

const Dashboard = ({ location }) => {

  const shouldRenderTransparentHeader = location.pathname === routes.DASHBOARD;

  return (
    <div className={'dashboard-container'}>
      <Header transparentMode={shouldRenderTransparentHeader}/>
      <Switch>
        <Route exact path={routes.DASHBOARD}
               component={Landing}/>
      </Switch>
    </div>
  );
}

export default withRouter(Dashboard);