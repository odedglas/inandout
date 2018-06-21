import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import SignOutButton from '../common/SignOut';

class Header extends React.Component {

  static propTypes = {
    transparentMode: PropTypes.bool,
  };

  render () {

    const { transparentMode, user } = this.props;

    const avatarBackground = {
      'backgroundColor' : user.avatarColor
    };
    const containerCls = `header px-3 py-2 ${transparentMode ? 'transparent' : ''}`;

    return (
      <div className={containerCls}>
        <div className={'logo'}>
          <img src={require('@img/logo.png')} alt='logo' />
        </div>
        <div className={'flex'}> </div>
        <Avatar className={'avatar'} style={avatarBackground}> {user.initials}</Avatar>
        <SignOutButton/>
      </div>
    );
  }
}
export default connect(state => ({
  user: state.user.currentUser,
}), {})(Header);
