import React, {Component} from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { asyncComponent } from 'react-async-component';

import LoadingMask from './common/LoadingMask';
import { getRoutes } from './Routes'
import withAuthentication from './hoc/withAuthentication';

require('react-onsenui');

const Welcome = asyncComponent({
  resolve: () => import('./Welcome')
});

class App extends Component {

  render() {

    const { authenticating, loading, isAuthenticated} = this.props;
    return (
      <Router>
        <Route
          render={({ location }) => (
            authenticating ? <Welcome /> :
              <LoadingMask loading={loading}>
                <div className={'col-flex h-100'}>
                  { getRoutes(isAuthenticated, location) }
                  <hr/>
                </div>
              </LoadingMask>
          )}
        />
      </Router>
    );
  }
}

export default compose(
  withAuthentication,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    authenticating: state.authentication.authenticating,
    currentUser: state.authentication.currentUser,
    loading: state.loading.isLoading,
  }), {})
)(App);
