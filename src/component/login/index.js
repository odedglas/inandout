import React, {Component} from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import {
  Button,
  Input
} from 'react-onsenui'
import {SignUpLink} from '../signup'
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
    this.submitBtn = React.createRef();
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

    console.log(`In login render`);
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
              <Input
                value={email}
                float
                autocomplete='email'
                onChange={event => this.handleStateChange('email', event.target.value)}
                type="email"
                required
                placeholder="Email Address"
              />
            </div>
            <div className={'form-control'}>
              <Input
                value={password}
                float
                autocomplete='current-password'
                onChange={event => this.handleStateChange('password', event.target.value)}
                type="password"
                required
                placeholder="Password"
              />
            </div>
            <div className={'form-control'}>
              <Button disabled={!isValid}
                      modifier='large'
                      onClick={this.doSubmit}>
                Sign In
              </Button>
              <button ref={this.submitBtn} className={'hidden-submit-handler'} type="submit"> </button>
            </div>
            <div>
              <SignUpLink/>
            </div>
            { error && <p>{error.message}</p> }
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  from: PropTypes.object,
  loginWithPassword: PropTypes.func.isRequired
};

const LoginLink = () =>
  <p className={'link'}>
    Have an account already?
    {' '}
    <Link to={routes.LOGIN}>Login</Link>
  </p>;

export default compose(
  withRouter,
  connect(null, { loginWithPassword })
)(LoginForm);

export {
  LoginForm,
  LoginLink
}