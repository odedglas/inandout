import React, {Component} from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {ROUTER as routes} from '../../constants';
import Header from './Header';
import Landing from './Landing';

class Dashboard extends Component {

  state = {
    dashboardBodyRef: undefined,
    headerShade: false,
  };

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

  render() {

    const { location } = this.props;
    const { headerShade } = this.state;
    const shouldRenderTransparentHeader = location.pathname === routes.DASHBOARD;

    return (

      <div className={'dashboard-container'}>
        <Header transparentMode={false} withShade={headerShade}/>
        <div className={'dashboard-body'}>
          <Switch>
            <Route exact path={routes.DASHBOARD}
                   component={Landing}/>
          </Switch>
        </div>
      </div>
    );

  }
}

export default withRouter(Dashboard);