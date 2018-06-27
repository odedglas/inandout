import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import { fetchUserProjects } from "@action/project";

import NotificationsDrawer from './drawer/NotificationsDrawer';
import {ROUTER as routes} from '@const/';
import Header from './Header';
import Landing from './Landing';
import ProjectHome from './project/ProjectHome';

import ProjectDrawer from './drawer/ProjectDrawer';
class Dashboard extends Component {

  static propTypes = {
    fetchUserProjects: PropTypes.func.isRequired
  };

  state = {
    showNotificationsBar: false,
  };

  componentDidMount() {

    //Loading user projects
    this.props.fetchUserProjects();
  }

  toggleNotificationsDrawer = () => {
    this.setState({
      showNotificationsBar: !this.state.showNotificationsBar,
    });
  };

  render() {

    const { location } = this.props;
    const { showNotificationsBar } = this.state;

    const isLanding = location.pathname === routes.DASHBOARD;

    return (
      <div className={'dashboard-container'}>
        <Header transparentMode={false}
                withShade={true}
                toggleNotificationsDrawer={this.toggleNotificationsDrawer}/>


        <div className={'flex h-100'}>
          { !isLanding ? <ProjectDrawer /> : null }
          <div className={'dashboard-body ' + (isLanding ? 'landing' : '')}>
            <Switch>
              <Route exact path={routes.DASHBOARD}
                     component={Landing}/>

              <Route path={routes.PROJECT}
                     component={() => <ProjectHome  project={location.state && location.state.selectedProject}/>}/>
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
  connect(null, { fetchUserProjects })
)(Dashboard);
