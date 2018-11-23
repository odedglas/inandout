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
import MobileHome from './MobileHome';
import MobileHeader from './MobileHeader';
import MobileDrawer from './MobileDrawer';
import {selectProject, createProjectSyncListener} from "@action/project";
class MobileDashboard extends Component {

  static propTypes = {
    init: PropTypes.func.isRequired,
    selectProject: PropTypes.func.isRequired,
    createProjectSyncListener: PropTypes.func.isRequired,
  };

  state = {
    showNotificationsBar: false,
  };

  componentDidMount() {

    const {selectProject} = this.props;

    //Dashboard init
    this.props.init(
      (projects) => {
        const selectedProject = projects[0];
        selectProject(selectedProject);
      }
    );

  }

  componentWillUnmount() {

    this.props.updateCachedProject();
  }

  componentDidUpdate(prevProps) {

    const {selectedProject, selectedDate, createProjectSyncListener} = this.props;

    if (selectedProject.id !== prevProps.selectedProject.id) {
      createProjectSyncListener(selectedProject.id, selectedDate);
    }
  }

  toggleNotificationsDrawer = () => {
    this.setState({
      showNotificationsBar: !this.state.showNotificationsBar,
    });
  };

  render() {

    const {showNotificationsBar} = this.state;

    return (
      <div className={'mobile dashboard-container'}>

        <MobileHeader toggleNotificationsDrawer={this.toggleNotificationsDrawer} />

        <div className={'flex h-100'}>
          <MobileDrawer/>
          <div className={'dashboard-body'}>
            <Switch>

              <Route path={routes.DASHBOARD}
                     component={MobileHome}/>

              <Route path={routes.PROJECT}
                     component={MobileHome}/>
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
  connect((state) => ({
    selectedProject: state.project.selectedProject,
  }), {init, createProjectSyncListener, selectProject})
)(MobileDashboard);
