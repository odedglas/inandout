import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import TelegramLogin from './TelegramLogin'
import {FIREBASE_LOGIN_PROVIDERS} from '@const/';
import {loginWithProvider} from '@action/authentication';
import {ROUTER} from "@const/";

import DynamicIcon from "../common/DynamicIcon";

class LoginWithMedia extends Component {

  static propTypes = {
    loginWithProvider: PropTypes.func.isRequired,
  };

  handleProviderLogin = providerName => {

    this.props.loginWithProvider(
      providerName,
      () => this.props.history.push(ROUTER.DASHBOARD)
    );
  };

  render() {

    return (
      <div className={'login-with-media'}>

        <div className={'title'}>
          Or connect with:
        </div>
        <div className={'media-icons-holder'}>
          <div className={'media-icon'} onClick={() => this.handleProviderLogin(FIREBASE_LOGIN_PROVIDERS.GOOGLE)}>
            <DynamicIcon name={'google'}/>
          </div>

          <div className={'media-icon'} onClick={() => this.handleProviderLogin(FIREBASE_LOGIN_PROVIDERS.FACEBOOK)}>
            <DynamicIcon name={'facebook'}/>
          </div>

          <div className={'media-icon'} onClick={() => this.handleProviderLogin(FIREBASE_LOGIN_PROVIDERS.TWITTER)}>
            <DynamicIcon name={'twitter'}/>
          </div>

          <div className={'media-icon'}>
            <DynamicIcon name={'telegram'}/>
            <TelegramLogin />
          </div>

        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    null,
    {loginWithProvider}
  )
)(LoginWithMedia);