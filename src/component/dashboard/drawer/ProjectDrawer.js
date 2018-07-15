import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {NavLink, withRouter} from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DynamicIcon from '@common/DynamicIcon';

import navigationUtil from '@util/navigation'
import { toggleProjectDrawer } from '@action/project';

class ProjectDrawer extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    toggleProjectDrawer: PropTypes.func.isRequired,
  };

  handleDrawerToggle = () => {

    const newOpenState = !this.props.open;

    this.props.toggleProjectDrawer(newOpenState);
  };

  drawerItem = (path, icon, text) => {

    const { selectedProject, location} = this.props;

    const fullPath = navigationUtil.projectLink(
      selectedProject,
      path
    );

    const isActive = fullPath === location.pathname;

    return (
      <ListItem button className={`drawer-item p-0 ${isActive ? 'active' : ''}`}>
        <NavLink activeClassName='is-active' className={'drawer-link'} exact={true} to={fullPath}>
          <ListItemIcon className={'icon'}>
            {icon}
          </ListItemIcon>
          <ListItemText className={'drawer-item-text'} primary={text} />
        </NavLink>
      </ListItem>
    );
  };

  render() {

    const { open} = this.props;
    const drawerClasses = `project-drawer ${!open ? 'collapsed' : ''}`;

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: drawerClasses,
        }}
        open={open}
      >
        <ListItem button onClick={this.handleDrawerToggle} className={'toggle-drawer'}>
          <ListItemIcon>
            {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </ListItemIcon>
        </ListItem>
        <Divider/>

        {this.drawerItem(``, <DynamicIcon name={'home'}/>, 'Home')}
        {this.drawerItem('budgets',  <DynamicIcon name={'budgets'}/>, 'Budgets')}
        {this.drawerItem('transactions',  <DynamicIcon name={'transactions'}/>, 'Transactions')}
        {this.drawerItem('categories',  <DynamicIcon name={'categories'}/>, 'Categories')}
        {this.drawerItem('customers',  <DynamicIcon name={'customers'}/>, 'Customers')}
        {this.drawerItem('calendar',  <DynamicIcon name={'calendar'}/>, 'Calendar')}
        {this.drawerItem('todos',  <DynamicIcon name={'todo'}/>, 'Todo\'s')}
      </Drawer>
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