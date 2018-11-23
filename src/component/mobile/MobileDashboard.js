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
import NotificationsDrawer from '../dashboard/drawer/NotificationsDrawer';
import {ROUTER as routes} from '@const/';
import Landing from '../dashboard/landing/Landing';
import MobileView from './MobileView';
import MobileHeader from './MobileHeader';
import MobileDrawer from './MobileDrawer';

class MobileDashboard extends Component {

  static propTypes = {
    init: PropTypes.func.isRequired,
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

        <MobileHeader />

        <div className={'flex h-100'}>
          <MobileDrawer/>
          <div className={'dashboard-body ' + (isLanding ? 'landing' : '')}>
            <Switch>
              <Route exact path={routes.DASHBOARD}
                     component={Landing}/>

              <Route path={routes.PROJECT}
                     component={MobileView}/>
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
)(MobileDashboard);
