import React, {Component} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import auth from '@service/auth'
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
    } = this.props;

    this.setState({ error: undefined });
    event.preventDefault();

    if (this.validate()) {

      auth.signUp(email, passwordOne)
        .then(authUser => {
          debugger;
          if (displayName) {

          }
          this.setState(() => ({...INITIAL_STATE}));
          history.push(routes.HOME);
        })
        .catch(error => {
          console.log(this.state.error);
          this.handleStateChange('error', error);
        });
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

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={displayName}
          onChange={event => this.handleStateChange('displayName', event.target.value)}
          type="text"
          placeholder="Display Name"
        />
        <input
          value={email}
          onChange={event => this.handleStateChange('email', event.target.value)}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={passwordOne}
          onChange={event => this.handleStateChange('passwordOne', event.target.value)}
          type="password"
          placeholder="Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.handleStateChange('passwordTwo', event.target.value)}
          type="password"
          placeholder="Confirm Password"
        />
        <button type="submit" disabled={!isValid}>
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withRouter(SignUpForm);