import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FIREBASE_LOGIN_PROVIDERS} from '@const/';
import {loginWithProvider} from '@action/authentication';
import {setLoading} from '@action/loading';
import {ROUTER} from "@const/";

class TelegramLogin extends Component {

  static propTypes = {
    loginWithProvider: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired
  };

  componentDidMount () {
    window.TelegramLoginWidget = {
      onAuthSuccess: user => this.onAuthSuccess(user)
    };

    const script = document.createElement("script");

    script.src = "https://telegram.org/js/telegram-widget.js?5";
    script.setAttribute('data-telegram-login', "InNOutBot");
    script.setAttribute('data-size', "small");
    script.setAttribute('data-request-access', "true");
    script.setAttribute('data-userpic', "true");
    script.setAttribute('data-onauth', 'TelegramLoginWidget.onAuthSuccess(user)');

    script.async = true;
    this.instance.appendChild(script);

  }

  onAuthSuccess = (user) => {

    this.props.setLoading(true);

    fetch(
      "https://polar-beyond-57349.herokuapp.com/api/authenticate", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          ['Content-Type']: 'application/json; charset=utf-8'}
      }).then(result => result.json()).then(({authenticated, token, request}) => {

      const { first_name, last_name, username, photo_url } = request;

      if(authenticated) {
        this.props.loginWithProvider(
          FIREBASE_LOGIN_PROVIDERS.TELEGRAM,
          () => {},
          {
            token,
            displayName: `${first_name} ${last_name ? last_name : ''}`.trim() || username,
            photoUrl: photo_url,
            email: `${username}@telegram`
          }
        );

      }
      else{

        //Erro note
        this.props.setLoading(false);
      }

    })
  };

  render() {

    return (
      <div className={'telegram-login'} ref={component => {
        this.instance = component;
      }}>
      </div>
    );
  }
}

export default connect(
  null,
  {setLoading, loginWithProvider}
)(TelegramLogin)