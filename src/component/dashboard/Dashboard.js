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

import NotificationsDrawer from './drawer/NotificationsDrawer';
import {ROUTER as routes} from '@const/';
import Header from './header/Header';
import Landing from './landing/Landing';
import Project from './project/Project';

import ProjectDrawer from './drawer/ProjectDrawer';

class Dashboard extends Component {

  static propTypes = {
    init: PropTypes.func.isRequired
  };

  state = {
    showNotificationsBar: false,
  };

  componentDidMount() {

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

    return (
      <div className={'dashboard-container'}>
        <Header transparentMode={false}
                withShade={true}
                toggleNotificationsDrawer={this.toggleNotificationsDrawer}/>

        <div className={'flex h-100'}>
          {!isLanding ? <ProjectDrawer/> : null}
          <div className={'dashboard-body ' + (isLanding ? 'landing' : '')}>
            <Switch>
              <Route exact path={routes.DASHBOARD}
                     component={Landing}/>

              <Route path={routes.PROJECT}
                     component={Project}/>
            </Switch>
          </div>

          <NotificationsDrawer open={showNotificationsBar} toggleNotificationsDrawer={this.toggleNotificationsDrawer}>

          </NotificationsDrawer>

        </div>
      </div>
    );

  }
}

export default compose(
  withRouter,
  connect(null, {init})
)(Dashboard);
