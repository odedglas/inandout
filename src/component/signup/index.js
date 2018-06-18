import React, {Component} from 'react';
import {
  withRouter,
  Link,
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
import {LoginLink} from '../login';
import {ROUTER as routes} from '../../constants';

const INITIAL_STATE = {
  displayName: 'oded',
  email   : 'odedglas@gmail.com',
  passwordOne: 'wtfitsomg',
  passwordTwo: 'wtfitsomg',
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
      shouldSignUp ? <div className={'login-container'}>
        <form className={'login-form'} onSubmit={this.onSubmit}>
          <div className={'form-control'}>
            <Input
              value={displayName}
              onChange={event => this.handleStateChange('displayName', event.target.value)}
              type="text"
              float
              placeholder="Display Name"
            />
          </div>

          <div className={'form-control'}>
            <Input
              value={email}
              onChange={event => this.handleStateChange('email', event.target.value)}
              type="text"
              float
              placeholder="Email Address"
            />
          </div>

          <div className={'form-control'}>
            <Input
              value={passwordOne}
              onChange={event => this.handleStateChange('passwordOne', event.target.value)}
              type="password"
              float
              placeholder="Password"
            />
          </div>

          <div className={'form-control'}>
            <Input
              value={passwordTwo}
              onChange={event => this.handleStateChange('passwordTwo', event.target.value)}
              type="password"
              float
              placeholder="Confirm Password"
            />
          </div>

          <div className={'form-control'}>
            <Button disabled={!isValid}
                    modifier='large'
                    onClick={this.onSubmit}>
              Sign Up
            </Button>

            <button className={'hidden-submit-handler'} type="submit"> </button>
          </div>
          {error && <p>{error.message}</p>}

          <div>
            <LoginLink/>
          </div>
      </form>
      </div>: <Redirect to={{pathname:'dashboard'}}/>
    );
  }
}

SignUpForm.propTypes = {
  signUp: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired
};


const SignUpLink = () =>
  <p className={'link'}>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>;

export default compose(
  withRouter,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    loggingIn: state.authentication.loggingIn,
  }), { signUp })
)(SignUpForm);

export {
  SignUpForm,
  SignUpLink,
};