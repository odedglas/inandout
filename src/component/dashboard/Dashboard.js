import React, {Component} from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import { setLoading } from "@action/loading";

import NotificationsDrawer from './drawer/NotificationsDrawer';
import {ROUTER as routes} from '../../constants';
import Header from './Header';
import Landing from './Landing';
import ProjectHome from './project/ProjectHome';


class Dashboard extends Component {

  state = {
    dashboardBodyRef: undefined,
    headerShade: false,
    showNotificationsBar: false,
  };

  componentWillMount() {

  }

  componentDidMount() {

    const node = ReactDOM.findDOMNode(this);
    const dashboardBody = node.querySelector('.dashboard-body');
    dashboardBody.addEventListener('scroll', this.onScroll);

    this.setState({ dashboardBodyRef: dashboardBody})
  }

  componentWillUnmount() {

    this.state.dashboardBodyRef.removeEventListener('scroll', this.onScroll);

  }

  onScroll = (e) => {

    const bodyScrollTop = this.state.dashboardBodyRef.scrollTop;
    this.setState({ headerShade: bodyScrollTop > 0})
  };

  toggleNotificationsDrawer = () => {
    this.setState({
      showNotificationsBar: !this.state.showNotificationsBar,
    });
  };
  render() {

    const { location } = this.props;
    const { headerShade, showNotificationsBar } = this.state;

    let dashboardBackground = {};

    const isLanding = location.pathname === routes.DASHBOARD;
    if(isLanding) {
      dashboardBackground['backgroundImage'] =`url('${require('@img/dashboard-header.jpg')}')`;
    }

    return (
      <div className={'dashboard-container'}>
        <Header transparentMode={false}
                withShade={headerShade}
                toggleNotificationsDrawer={this.toggleNotificationsDrawer}/>

        <div className={'dashboard-body'} style={dashboardBackground}>
          <Switch>
            <Route exact path={routes.DASHBOARD}
                   component={Landing}/>

            <Route path={routes.PROJECT}
                   component={() => <ProjectHome  project={location.state && location.state.selectedProject}/>}/>
          </Switch>
          <NotificationsDrawer open={showNotificationsBar} toggleNotificationsDrawer={this.toggleNotificationsDrawer}>

          </NotificationsDrawer>
        </div>
      </div>
    );

  }
}

export default compose(
  withRouter,
  connect(null, {setLoading})
)(Dashboard);
