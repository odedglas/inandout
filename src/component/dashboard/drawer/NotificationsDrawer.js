import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const emptyContentIcon = require('@img/hot-air-balloon.svg')

class NotificationsDrawer extends Component {

  state = {
    notifications: [],
    emptyContentIcon: emptyContentIcon,
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleNotificationsDrawer: PropTypes.func.isRequired,
  };

  render () {

    const { toggleNotificationsDrawer, open } = this.props;
    const { notifications, emptyContentIcon } = this.state;
    const isEmpty = notifications.length === 0;

    return (
      <Drawer anchor="right" open={open}
              disableRestoreFocus={true}
              onClose={() => toggleNotificationsDrawer()}>
        <div
          className={'notifications-drawer'}
          tabIndex={0}
          role="button"
          onClick={() => toggleNotificationsDrawer()}
          onKeyDown={() =>toggleNotificationsDrawer()}
        >

          <div className={'header'}>
            <span className={'text'}>
              Notifications
            </span>
            <IconButton className={'close'}>
              <CloseIcon/>
            </IconButton>
            <div>

            </div>
          </div>
          <div className={'content'}>
            {
              !isEmpty ? 'I have content'
                : <div className={'empty-notifications'}>
                  <div className={'icon'}>
                    <img src={emptyContentIcon} alt="no-alerts" />
                  </div>
                  <div className={'context'}>
                    You don't have any notifications

                    <span> Notifications from projects you work on will appear here. </span>
                  </div>
                </div>
            }
          </div>
        </div>
      </Drawer>
    );
  }
}

export default NotificationsDrawer;