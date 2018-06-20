import React from 'react';
import { connect } from 'react-redux';
import {ROUTER as routes} from '../../constants'
import PropTypes from 'prop-types';
import { createAuthenticationListener } from '../../actions/authentication'

const withAuthentication = (Component) => {

  class WithAuthentication extends React.Component {

    componentDidMount() {

      //Preparing redirect case user is not authenticated and path request need's one
      const _location = window.location;
      const pathname = _location.pathname, search = _location.search;
      const requiresAuthentication = [routes.SIGN_UP, routes.LOGIN].indexOf(pathname) === -1;

      let location = undefined;
      if(!this.props.isAuthenticated && requiresAuthentication) {
        location = {
          pathname,
          search
        }
      }

      this.props.createAuthenticationListener(location);
    }

    render() {
      return (
        <Component/>
      );
    }
  }

  WithAuthentication.propTypes = {
    createAuthenticationListener: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  return connect(state => ({
    isAuthenticated: state.authentication.authenticated,
  }), { createAuthenticationListener })(WithAuthentication)
};

export default withAuthentication;

