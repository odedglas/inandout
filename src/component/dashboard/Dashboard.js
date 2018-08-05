import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {init} from "@action/dashboard";
import AreYouSure from '@modal/AreYouSure'
import NotificationsDrawer from './drawer/NotificationsDrawer';
import {ROUTER as routes} from '@const/';
import Header from './header/Header';
import Landing from './landing/Landing';
import Settings from './settings/Settings';
import Project from './project/Project';

import ProjectDrawer from './drawer/ProjectDrawer';

class Dashboard extends Component {

  static propTypes = {
    init: PropTypes.func.isRequired,
  };

  state = {
    showNotificationsBar: false,
  };

  componentDidMount() {
    debugger;
    //Dashboard init
    this.props.init();
  }

  toggleNotificationsDrawer = () => {
    this.setState({
      showNotificationsBar: !this.state.showNotificationsBar,
    });
  };

  render() {

    const {location} = this.props;
    const {showNotificationsBar} = this.state;

    const isLanding = location.pathname === routes.DASHBOARD;
    const isProjectRoute = location.pathname.startsWith('/dashboard/project');

    return (
      <div className={'dashboard-container'}>
        <Header transparentMode={false}
                withShade={true}
                toggleNotificationsDrawer={this.toggleNotificationsDrawer}/>

        <div className={'flex h-100'}>
          {isProjectRoute ? <ProjectDrawer/> : null}
          <div className={'dashboard-body ' + (isLanding ? 'landing' : '')}>
            <Switch>
              <Route exact path={routes.DASHBOARD}
                     component={Landing}/>

              <Route exact path={routes.SETTINGS}
                     component={Settings}/>

              <Route path={routes.PROJECT}
                     component={Project}/>
            </Switch>
          </div>

          <NotificationsDrawer open={showNotificationsBar} toggleNotificationsDrawer={this.toggleNotificationsDrawer}>

          </NotificationsDrawer>

          <AreYouSure/>
        </div>
      </div>
    );

  }
}

export default compose(
  withRouter,
  connect(null, {init})
)(Dashboard);
