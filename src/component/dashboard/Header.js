import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserProfileMenu from './UserProfileMenu'

class Header extends React.Component {

  static propTypes = {
    transparentMode: PropTypes.bool,
  };

  render () {

    const { transparentMode, user } = this.props;
    const containerCls = `header px-3 py-2 ${transparentMode ? 'transparent' : ''}`;

    return (
      <div className={containerCls}>
        <div className={'logo'}>
          <img src={require('@img/logo.png')} alt='logo' />
        </div>
        <div className={'flex'}> </div>
        <UserProfileMenu user={user}/>
      </div>
    );
  }
}
export default connect(state => ({
  user: state.user.currentUser,
}), {})(Header);