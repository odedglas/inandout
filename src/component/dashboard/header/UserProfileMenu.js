import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  withRouter,
} from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Divider from '@material-ui/core/Divider';

import { signOut } from '@action/authentication';
import {ROUTER as routes} from '@const/';
class UserProfileMenu extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
  };

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = event => {
    if (this.userMenuTarget.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  doSignOut = () => {

    const { history } = this.props;
    this.setState({ open: false });

    this.props.signOut(
      () => history.push(routes.LOGIN)
    );
  };

  render () {

    const { user } = this.props;
    const { open } = this.state;

    //TODO - Handle srcSet when supported
    const avatarBackground = {
      'backgroundColor' : user.avatarColor
    };

    //TODO - Migrate to react-pooper v.1, With Ref
    return (
        <Manager>
          <Target>
            <div
              ref={node => {
                this.userMenuTarget = node;
              }}
            >
              <Avatar className={'avatar mx-3'}
                      aria-owns={open ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                      onClick={this.handleToggle}
                      style={avatarBackground}>
                {user.initials}
              </Avatar>
            </div>
          </Target>
          <Popper
            placement="bottom-end"
            eventsEnabled={open}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="menu-list-grow">
                <Paper className={'user-menu-holder'}>
                  <MenuList role="menu">
                    <div className={'user-info'}>
                      <div className={'user-image'}>
                        <Avatar className={'user-menu-avatar'} style={avatarBackground}> {user.initials} </Avatar>
                      </div>
                      <div className={'details'}>
                        <h3> {user.displayName} </h3>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <Divider />
                    <MenuItem className={'menu-item'} onClick={this.handleClose}>
                      <ListItemIcon className={'menu-icon'}>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText className={'menu-text'} primary="Settings" />
                    </MenuItem>
                    <MenuItem className={'menu-item'} onClick={this.handleClose}>
                      <ListItemIcon className={'menu-icon'}>
                        <FeedbackIcon />
                      </ListItemIcon>
                      <ListItemText className={'menu-text'} primary="Feedback"/>
                    </MenuItem>
                    <MenuItem className={'menu-item'} onClick={this.handleClose}>
                      <ListItemIcon className={'menu-icon'}>
                        <HelpIcon />
                      </ListItemIcon>
                      <ListItemText className={'menu-text'} primary="Help" />
                    </MenuItem>
                    <MenuItem className={'menu-item'} onClick={this.doSignOut}>
                      <ListItemIcon className={'menu-icon'}>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText className={'menu-text'} primary="Logout" />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
    );
  }
}

export default compose(
  withRouter,
  connect(null, { signOut })
)(UserProfileMenu);