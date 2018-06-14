import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createAuthenticationListener } from '../../actions/authentication'

const withAuthentication = (Component) => {

  class WithAuthentication extends React.Component {

    componentDidMount() {
      this.props.createAuthenticationListener();
    }

    render() {
      return (
        <Component/>
      );
    }
  }

  WithAuthentication.propTypes = {
    createAuthenticationListener: PropTypes.func.isRequired
  };

  return connect(null, { createAuthenticationListener })(WithAuthentication)
};

export default withAuthentication;

