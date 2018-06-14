import React, {Component} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
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
        () => {
          this.setState(() => ({...INITIAL_STATE}));
          history.push(routes.DASHBOARD);
          console.log("Loggin succes from: " + from)
        },
        (error) => this.handleStateChange('error', error)
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

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.handleStateChange('email', event.target.value)}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={password}
          onChange={event => this.handleStateChange('password', event.target.value)}
          type="password"
          placeholder="Password"
        />
        <button disabled={!isValid} type="submit">
          Sign In
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

LoginForm.propTypes = {
  from: PropTypes.string,
  loginWithPassword: PropTypes.func.isRequired
};

export default compose(
  withRouter,
  connect(null, { loginWithPassword })
)(LoginForm);