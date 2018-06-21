import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import InboxIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


class Header extends React.Component {

  static propTypes = {
    transparentMode: PropTypes.bool,
  };

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = event => {
    if (this.target1.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render () {

    const { transparentMode, user } = this.props;
    const { open } = this.state;
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

        <Manager>
          <Target>
            <div
              ref={node => {
                this.target1 = node;
              }}
            >
              <Avatar className={'avatar'}
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
              <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={'user-menu-holder'}>
                  <MenuList role="menu">
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                    <MenuItem onClick={this.handleClose}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </div>
    );
  }
}
export default connect(state => ({
  user: state.user.currentUser,
}), {})(Header);