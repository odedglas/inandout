import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DynamicIcon from '@common/DynamicIcon';
import Tooltip from '@material-ui/core/Tooltip';
import ProjectToolbar from '../dashboard/project/home/ProjectToolbar';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import {toggleProjectDrawer} from '@action/project';

class MobileHeader extends React.Component {

  static propTypes = {
    selectedDate: PropTypes.object.isRequired,
    toggleNotificationsDrawer: PropTypes.func.isRequired,
    toggleProjectDrawer: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object),
  };

  toggleNotificationsDrawer = () => {
    this.props.toggleNotificationsDrawer();
  };

  render () {

    const {notifications, selectedDate, projects, toggleProjectDrawer} = this.props;

    const hasProjects = projects.length > 0;
    const newNotifications = notifications.filter(n => n.unread);
    const hasNewNotifications = newNotifications.length > 0;
    const notificationsBadge = hasNewNotifications ? newNotifications.length : '';

    return (
      <div className={'app-header px-3 py-2'}>

        <span className={'toggle-drawer'} onClick={() => toggleProjectDrawer(true)}>
          <MenuIcon/>
        </span>
        <div className={'flex'}>
          {hasProjects && <ProjectToolbar selectedDate={selectedDate} showToday={false} showSelected={true}/>}
        </div>
        <div>
          <Badge badgeContent={notificationsBadge} className={`notification-badge ${!hasNewNotifications ? 'empty' : ''}`}>
            <IconButton className={'notifications-button'} onClick={this.toggleNotificationsDrawer}>
              <DynamicIcon name={'notification'}/>
            </IconButton>
          </Badge>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
  projects: state.projects,
  selectedDate: state.project.selectedDate,
  notifications: state.notifications
}), {toggleProjectDrawer})(MobileHeader);