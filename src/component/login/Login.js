import React, {Component} from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {SignUpLink} from '../signup/SignUp'
import SnackbarNotification from '../framework/SnackbarNotification';
import {ROUTER as routes} from '../../constants';
import { loginWithPassword } from '../../actions/authentication'

const INITIAL_STATE = {
  email   : '',
  password: '',
  error   : undefined
};

class LoginForm extends Component {

  static propTypes = {
    from: PropTypes.object,
    loginWithPassword: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
    this.submitBtn = React.createRef();
  }

  onSubmit = (event) => {

    const {
      email,
      password,
    } = this.state;

    const {
      history,
      authenticationRedirect,
      loginWithPassword
    } = this.props;

    this.setState({error: undefined});
    event.preventDefault();

    if (this.validate()) {
      loginWithPassword(
        email,
        password,
        () => history.push(authenticationRedirect ? authenticationRedirect : routes.DASHBOARD),
        (error) => {
          this.handleStateChange('error', error);
        }
      )
    }
  };

  doSubmit = () =>  this.submitBtn.current.click();

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
      <div className={'col-flex just-c h-100'}>
        <div className={'login-layout'}>
          <img src={require('@img/login-bg.svg')} alt='bg' />
        </div>
        <div className={'login-container'}>
          <div className={'logo'}>
            <img src={require('@img/logo.png')} alt='logo' />
          </div>
          <form className={'login-form'} onSubmit={this.onSubmit}>
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
                id="password-input"
                label="Password"
                value={password}
                onChange={event => this.handleStateChange('password', event.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <div className={'form-control'}>
              <Button disabled={!isValid}
                      variant="contained"
                      color="primary"
                      onClick={this.doSubmit}>
                Sign In
              </Button>
              <button ref={this.submitBtn} className={'hidden-submit-handler'} type="submit"> </button>
            </div>
            <div>
              <SignUpLink/>
            </div>
          </form>
        </div>
        <SnackbarNotification onClose={() => this.handleStateChange('error', undefined)}
                              anchor={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              open={error !== undefined}
                              duration={2500}
                              variant="error"
                              message="Wrong username or password">
        </SnackbarNotification>
      </div>
    );
  }
}

const LoginLink = () =>
  <p className={'link'}>
    Have an account already?
    {' '}
    <Link to={routes.LOGIN}>Login</Link>
  </p>;

export default compose(
  withRouter,
  connect(state => ({
    authenticationRedirect: state.authentication.authenticationRedirect,
  }), { loginWithPassword })
)(LoginForm);

export {
  LoginForm,
  LoginLink
}