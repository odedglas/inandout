import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';

import { connect } from 'react-redux';
import {compose} from 'recompose';

import IconButton from '@material-ui/core/IconButton';
import DynamicIcon from '@common/DynamicIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import UserProfileMenu from './UserProfileMenu'

import {ROUTER} from '@const/'

class Header extends React.Component {

  static propTypes = {
    transparentMode: PropTypes.bool,
    withShade: PropTypes.bool,
    toggleNotificationsDrawer: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object),
  };

  toggleNotificationsDrawer = () => {
    this.props.toggleNotificationsDrawer();
  };

  gotoHome = () => {
    this.props.history.push(ROUTER.DASHBOARD);
  };

  render () {

    const { transparentMode, withShade, user, notifications} = this.props;
    const containerCls = `app-header px-3 py-2 ${transparentMode ? 'transparent' : ''} ${withShade ? 'with-sade' : ''}`;

    const newNotifications = notifications.filter(n => n.unread);
    const hasNewNotifications = newNotifications.length > 0;
    const notificationsBadge = hasNewNotifications ? newNotifications.length : '';

    return (
      <div className={containerCls}>
        <div className={'logo'} onClick={this.gotoHome}>
          <img src={require('@img/logo-white.png')} alt='logo' />
        </div>
        <div className={'flex'}> </div>
        <div>
          <Tooltip title={'Notifications'}>
            <Badge badgeContent={notificationsBadge} className={`notification-badge ${!hasNewNotifications ? 'empty' : ''}`}>
              <IconButton className={'notifications-button'} onClick={this.toggleNotificationsDrawer}>
                <DynamicIcon name={'notification'}/>
              </IconButton>
            </Badge>
          </Tooltip>
        </div>
        <UserProfileMenu user={user}/>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    user: state.user,
    notifications: state.notifications
  }), {})
)(Header);