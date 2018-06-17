import React, {Component} from 'react';
import {
  Redirect,
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  Button,
  Input
} from 'react-onsenui'

import PropTypes from 'prop-types';
import {ROUTER as routes} from '../../constants';
import { loginWithPassword } from '../../actions/authentication'

const INITIAL_STATE = {
  email   : '',
  password: '',
  error   : null,
};

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onSubmit = (event) => {

    const {
      email,
      password,
    } = this.state;

    const {
      history,
      from,
      loginWithPassword
    } = this.props;

    this.setState({error: undefined});
    event.preventDefault();

    if (this.validate()) {

      loginWithPassword(
        email,
        password,
        () =>  history.push(from ? from : routes.DASHBOARD),
        (error) => {
          this.handleStateChange('error', error);
        }
      )
    }
  };

  handleStateChange = (prop, value) => {

    const update = {};
    update[prop] = value;
    this.setState(update)
  };

  validate = () => {

    const {
      email,
      password
    } = this.state;

    return !(password === '' ||
             email === '');
  };

  render() {
    const {
      email,
      password,
      error,
    } = this.state;
    const isValid = this.validate();
    const { isAuthenticated, loggingIn} = this.props;

    const shouldLogin = !isAuthenticated || loggingIn;

    return (
      shouldLogin ? <div className={'login-container'}>
        <form className={'login-form'} onSubmit={this.onSubmit}>
          <div className={'form-control'}>
            <Input
              value={email}
              float
              onChange={event => this.handleStateChange('email', event.target.value)}
              type="text"
              placeholder="Email Address"
            />
          </div>
          <div className={'form-control'}>
            <Input
              value={password}
              float
              onChange={event => this.handleStateChange('password', event.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={'form-control'}>
            <Button disabled={!isValid}
                    modifier='large'
                    onClick={this.onSubmit}>
              Sign In
            </Button>
            <button className={'hidden-submit-handler'} type="submit"> </button>
          </div>
          { error && <p>{error.message}</p> }
      </form>
      </div> : <Redirect to={{pathname:'dashboard'}}/>
    );
  }
}

LoginForm.propTypes = {
  from: PropTypes.object,
  loginWithPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired
};

export default compose(
  withRouter,
  connect(state => ({
    isAuthenticated: state.authentication.authenticated,
    loggingIn: state.authentication.loggingIn,
  }), { loginWithPassword })
)(LoginForm);