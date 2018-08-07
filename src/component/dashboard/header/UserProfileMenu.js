import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter,
} from 'react-router-dom';

import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Divider from '@material-ui/core/Divider';
import UserAvatar from '@common/UserAvatar';

import {ROUTER} from '@const/'
import {signOut} from '@action/authentication';

class UserProfileMenu extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
  };

  state = {
    open: false,
    anchorEl: null,
  };

  handleToggle = () => {
    this.setState({open: !this.state.open});
  };

  handleMenuOpen = event => this.setState({open: true, anchorEl: event.currentTarget})

  handleClose = event => this.setState({open: false, anchorEl: null});

  gotoSettings = () => {

    this.handleClose();
    this.props.history.push(ROUTER.SETTINGS);
  };

  doSignOut = () => {

    this.setState({open: false});

    this.props.signOut();
  };

  render() {

    const {user} = this.props;
    const {open, anchorEl,} = this.state;

    return (
      <div>
        <UserAvatar user={user}
                    additionalClass={'mx-3'}
                    aria-haspopup="true"
                    onClick={this.handleMenuOpen}
                    size={'large'} />
        <Popover
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuList className={'user-menu-holder'} role="menu">
            <div className={'user-info'}>
              <div className={'user-image'}>
                <UserAvatar user={user} />
              </div>
              <div className={'details'}>
                <h3> {user.displayName} </h3>
                <span>{user.email}</span>
              </div>
            </div>
            <Divider/>
            <MenuItem className={'menu-item'} onClick={this.gotoSettings}>
              <ListItemIcon className={'menu-icon'}>
                <SettingsIcon/>
              </ListItemIcon>
              <ListItemText className={'menu-text'} primary="Settings"/>
            </MenuItem>
            <MenuItem className={'menu-item'} onClick={this.handleClose}>
              <ListItemIcon className={'menu-icon'}>
                <FeedbackIcon/>
              </ListItemIcon>
              <ListItemText className={'menu-text'} primary="Feedback"/>
            </MenuItem>
            <MenuItem className={'menu-item'} onClick={this.handleClose}>
              <ListItemIcon className={'menu-icon'}>
                <HelpIcon/>
              </ListItemIcon>
              <ListItemText className={'menu-text'} primary="Help"/>
            </MenuItem>
            <MenuItem className={'menu-item'} onClick={this.doSignOut}>
              <ListItemIcon className={'menu-icon'}>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText className={'menu-text'} primary="Logout"/>
            </MenuItem>
          </MenuList>
        </Popover>

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(null, {signOut})
)(UserProfileMenu);