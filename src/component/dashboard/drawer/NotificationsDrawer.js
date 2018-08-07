import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import UserAvatar from '@common/UserAvatar';
import {KEYBOARD_CODES} from "@const/";
import notificationService from '@service/notification';
import util from '@util/'
import {createNotificationSyncListener, handleNotificationAction} from "@action/notification";

class NotificationsDrawer extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object.isRequired,
    toggleNotificationsDrawer: PropTypes.func.isRequired,
    createNotificationSyncListener: PropTypes.func.isRequired,
    handleNotificationAction: PropTypes.func.isRequired,
  };

  state = {
    filledNotifications: []
  };

  componentDidMount() {

    //Creating user notification listener
    this.props.createNotificationSyncListener(
      this.props.user
    );
  }

  static getDerivedStateFromProps(props, state) {

    if (props.open) {

      const {users, notifications} = props;

      return {
        filledNotifications: notificationService.mergeNotifications(
          notifications,
          users
        )
      }
    }

    return null;
  }

  handleKeyDown = event => {

    if (event.keyCode === KEYBOARD_CODES.ESCAPE) {
      this.props.toggleNotificationsDrawer()
    }
  };

  handleNotificationAction = (notification, action) => {

    this.props.handleNotificationAction(
      notification,
      action,
      this.props.user,
      this.props.history,
      () => this.props.toggleNotificationsDrawer()
    );
  };

  notificationRender = notification => {

    const hasActions = notification.actions.length > 0;
    const isUnread = notification.unread;

    let completedAction;
    if(notification.completedAction) {
      completedAction = notification.actions.find(a => a.key === notification.completedAction);
    }

    return (
      <div key={notification.id}
           className={`notification hover-popout p-2 ${isUnread ? 'unread' : ''}`}>
        <div className={'notification-body flex'}>
          <UserAvatar user={notification.from} size={'small'}/>
          <div className={'px-3'}>
            <span className={'text mt-2'}>
              <span dangerouslySetInnerHTML={{ __html: notification.text }}/>
              <div className={'date'}> {notification.date}</div>
              </span>
          </div>

        </div>
        {
          (!completedAction && hasActions) ? <div className={'notification-footer'}>
            {
              notification.actions.map(action => (
                <Button onClick={() => this.handleNotificationAction(notification, action)}
                        key={action.key}
                        size={'small'}
                        color={action.color}>
                  {action.text}
                </Button>
              ))
            }
          </div> : null
        }

        {
          completedAction ? <div className={'notification-result mt-2'}>
          <span>* {completedAction.completedText}</span>
          </div>: null
        }

      </div>
    )
  };

  emptyDrawerView = () => (
    <div className={'empty-notifications'}>
      <div className={'icon'}>
      </div>
      <div className={'context'}>
        You don't have any notifications

        <span> Notifications from projects you work on will appear here. </span>
      </div>
    </div>
  );

  render() {

    const {toggleNotificationsDrawer, open} = this.props;
    const {filledNotifications} = this.state;
    const isEmpty = filledNotifications.length === 0;

    const _notifications = filledNotifications.sort(util.sortJsonFN([
      {name:'unread', reverse: true},
      {name:'created', reverse: true},
      ]));

    return (
      <Drawer anchor="right" open={open}
              disableRestoreFocus={true}
              onClose={() => toggleNotificationsDrawer()}>
        <div
          className={'notifications-drawer'}
          tabIndex={0}
          role="button"
          onKeyDown={this.handleKeyDown}
        >

          <div className={'header'}>
            <span className={'text'}>
              Notifications
            </span>
            <IconButton className={'close'} onClick={() => toggleNotificationsDrawer()}>
              <CloseIcon/>
            </IconButton>
            <div>

            </div>
          </div>
          <div className={'content'}>
            {
              !isEmpty ?
                <div className={'notifications-wrapper py-2 px-3'}>

                  {_notifications.map(notification => this.notificationRender(notification))}

                </div>
                : this.emptyDrawerView()
            }
          </div>
        </div>
      </Drawer>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    user: state.user,
    users: state.dashboard.users,
    notifications: state.notifications
  }), {createNotificationSyncListener, handleNotificationAction})
)(NotificationsDrawer);