import React, {Component} from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import {
  Button,
  Input
} from 'react-onsenui'

import {signUp} from '../../actions/authentication';
import {ROUTER as routes} from '../../constants';

const INITIAL_STATE = {
  displayName: '',
  email      : '',
  passwordOne: '',
  passwordTwo: '',
  error      : null,
};

class SignUpForm extends Component {

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onSubmit = (event) => {

    const {
      displayName,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
      signUp,
    } = this.props;

    this.setState({ error: undefined });
    event.preventDefault();

    if (this.validate()) {

      signUp(
        email,
        passwordOne,
        displayName,
        () => history.push(routes.DASHBOARD),
        (e) => this.handleStateChange('error', e)
      );
    }
  };

  handleStateChange = (prop, value) => {

    const update = {};
    update[prop] = value;
    this.setState(update)
  };

  validate = () => {

    const {
      displayName,
      email,
      passwordOne,
      passwordTwo
    } = this.state;

    return !(passwordOne !== passwordTwo ||
             passwordOne === '' ||
             email === '' ||
             displayName === '');
  };

  render() {
    const {
      displayName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isValid = this.validate();
    const { isAuthenticated, loggingIn} = this.props;

    const shouldSignUp = !isAuthenticated || loggingIn;

    return (
      shouldSignUp ? <form onSubmit={this.onSubmit} className={'login-container'}>
        <Input
          value={displayName}
          onChange={event => this.handleStateChange('displayName', event.target.value)}
          type="text"
          placeholder="Display Name"
        />
        <Input
          value={email}
          onChange={event => this.handleStateChange('email', event.target.value)}
          type="text"
          placeholder="Email Address"
        />
        <Input
          value={passwordOne}
          onChange={event => this.handleStateChange('passwordOne', event.target.value)}
          type="password"
          placeholder="Password"
        />
        <Input
          value={passwordTwo}
          onChange={event => this.handleStateChange('passwordTwo', event.target.value)}
          type="password"
          placeholder="Confirm Password"
        />

        <Button disabled={!isValid}
                modifier='large'
                onClick={this.onSubmit}>
          Sign Up
        </Button>

        <button className={'hidden-submit-handler'} type="submit"> </button>

        {error && <p>{error.message}</p>}
      </form> : <Redirect to={{pathname:'dashboard'}}/>
    );
  }
}

SignUpForm.propTypes = {
  signUp: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired
};

export default compose(
  withRouter,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    loggingIn: state.authentication.loggingIn,
  }), { signUp })
)(SignUpForm);