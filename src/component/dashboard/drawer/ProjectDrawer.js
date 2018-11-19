import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {NavLink, withRouter} from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import DynamicIcon from '@common/DynamicIcon';
import util from '@util/'
import navigationUtil from '@util/navigation'
import {toggleProjectDrawer} from '@action/project';

class ProjectDrawer extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    toggleProjectDrawer: PropTypes.func.isRequired,
  };

  handleDrawerToggle = () => {

    const newOpenState = !this.props.open;

    this.props.toggleProjectDrawer(newOpenState);
  };

  drawerClick = () => {

    util.isMobile() && this.handleDrawerToggle();
  };

  drawerItem = (path, icon, text) => {

    const {selectedProject, location} = this.props;

    const fullPath = navigationUtil.projectLink(
      selectedProject,
      path
    );

    const isActive = fullPath === location.pathname;

    return (
      <ListItem button className={`drawer-item p-0 ${isActive ? 'active' : ''}`} onClick={this.drawerClick}>
        <NavLink activeClassName='is-active' className={'drawer-link'} exact={true} to={fullPath}>
          <ListItemIcon className={'icon'}>
            {icon}
          </ListItemIcon>
          <ListItemText className={'drawer-item-text'} primary={text}/>
        </NavLink>
      </ListItem>
    );
  };

  render() {

    const {open} = this.props;
    const drawerClasses = `project-drawer ${!open ? 'collapsed' : ''}`;

    const drawer = ( <div>
        <ListItem button onClick={this.handleDrawerToggle} className={'toggle-drawer'}>
          <ListItemIcon>
            {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </ListItemIcon>
        </ListItem>
        <Divider/>

        {this.drawerItem(``, <DynamicIcon name={'home'}/>, 'Home')}
        {this.drawerItem('budgets', <DynamicIcon name={'budgets'}/>, 'Budgets')}
        {this.drawerItem('transactions', <DynamicIcon name={'transactions'}/>, 'Transactions')}
        {this.drawerItem('categories', <DynamicIcon name={'categories'}/>, 'Categories')}
        {this.drawerItem('customers', <DynamicIcon name={'customers'}/>, 'Customers')}
        {this.drawerItem('calendar', <DynamicIcon name={'calendar'}/>, 'Calendar')}
      </div>
    );

    return (
      <div>
        <Hidden mdUp>
          <SwipeableDrawer
            variant="temporary"
            anchor={'left'}
            open={open}
            onOpen={this.handleDrawerToggle}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: 'project-drawer',
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open={open}
            classes={{
              paper: drawerClasses,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    open: state.project.drawerOpen,
  }), {toggleProjectDrawer})
)(ProjectDrawer);