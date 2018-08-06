import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {FIREBASE_LOGIN_PROVIDERS} from '@const/';
import {loginWithProvider} from '@action/authentication';

import DynamicIcon from "../common/DynamicIcon";

class LoginWithMedia extends Component {

  static propTypes = {
    loginWithProvider: PropTypes.func.isRequired,
  };

  handleProviderLogin = providerName => {

    this.props.loginWithProvider(
      providerName
    );
  };

  render() {

    return (
      <div className={'login-with-media'}>

        <div className={'title'}>
          Or connect with:
        </div>
        <div className={'media-icons-holder'}>
          <div className={'media-icon'} onClick={() => this.handleProviderLogin('google')}>
            <DynamicIcon name={'google'}/>
          </div>

          <div className={'media-icon'} onClick={() => this.handleProviderLogin('facebook')}>
            <DynamicIcon name={'facebook'}/>
          </div>

          <div className={'media-icon'} onClick={() => this.handleProviderLogin('twitter')}>
            <DynamicIcon name={'twitter'}/>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {loginWithProvider}
)
(LoginWithMedia);