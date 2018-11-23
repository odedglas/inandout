import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DynamicIcon from '@common/DynamicIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import {ROUTER} from '@const/'
import MenuIcon from '@material-ui/icons/Menu';
import {toggleProjectDrawer} from '@action/project';

class MobileHeader extends React.Component {

  static propTypes = {
    toggleNotificationsDrawer: PropTypes.func.isRequired,
    toggleProjectDrawer: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object),
  };

  toggleNotificationsDrawer = () => {
    this.props.toggleNotificationsDrawer();
  };

  gotoHome = () => {
    this.props.history.push(ROUTER.DASHBOARD);
  };

  render () {

    const {notifications, toggleProjectDrawer} = this.props;

    const newNotifications = notifications.filter(n => n.unread);
    const hasNewNotifications = newNotifications.length > 0;
    const notificationsBadge = hasNewNotifications ? newNotifications.length : '';

    return (
      <div className={'app-header with-sade px-3 py-2'}>

        <MenuIcon/>

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
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
  notifications: state.notifications
}), {toggleProjectDrawer})(MobileHeader);