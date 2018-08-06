import React, {Component} from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginWithMedia from '../login/LoginWtihMedia';
import {signUp} from '../../actions/authentication';
import {LoginLink} from '../login/Login';
import {ROUTER as routes} from '../../constants';

const INITIAL_STATE = {
  displayName: '',
  email   : '',
  passwordOne: '',
  passwordTwo: '',
  error      : null,
};

class SignUpForm extends Component {

  static propTypes = {
    signUp: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
    this.signupBtn = React.createRef();
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

  doSignup = () =>  this.signupBtn.current.click();

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

    console.log(`In signup render`);
    return (
      <div className={'col-flex just-c h-100'}>
        <div className={'login-layout'}>
          <img src={require('@img/signup-bg.svg')} alt='bg' />
        </div>
        <div className={'login-container'}>
          <div className={'logo'}>
            <img src={require('@img/logo.png')} alt='logo' />
          </div>
          <form className={'login-form'} onSubmit={this.onSubmit}>
            <div className={'form-control'}>
              <TextField
                id="display-name-input"
                label="Display Name"
                value={displayName}
                onChange={event => this.handleStateChange('displayName', event.target.value)}
              />
            </div>

            <div className={'form-control'}>
              <TextField
                id="email"
                label="Email Address"
                value={email}
                type="email"
                autoComplete="email"
                required
                onChange={event => this.handleStateChange('email', event.target.value)}
              />
            </div>
            <div className={'form-control'}>
              <TextField
                id="password-one-input"
                label="Password"
                value={passwordOne}
                onChange={event => this.handleStateChange('passwordOne', event.target.value)}
                type="password"
                autoComplete="off"
                required
              />
            </div>

            <div className={'form-control'}>
              <TextField
                id="password-two-input"
                label="Confirm Password"
                value={passwordTwo}
                onChange={event => this.handleStateChange('passwordTwo', event.target.value)}
                type="password"
                autoComplete="off"
                required
              />
            </div>

            <div className={'form-control'}>
              <Button disabled={!isValid}
                      variant="contained"
                      color="primary"
                      onClick={this.doSignup}>
                Sign Up
              </Button>

              <button ref={this.signupBtn}
                      className={'hidden-submit-handler'}
                      type="submit"> </button>
            </div>
            {error && <p>{error.message}</p>}

          </form>
          <LoginWithMedia/>
          <div>
            <LoginLink/>
          </div>
        </div>
      </div>
    );
  }
}

const SignUpLink = () =>
  <p className={'link'}>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>;

export default compose(
  withRouter,
  connect(null, { signUp })
)(SignUpForm);

export {
  SignUpForm,
  SignUpLink,
};