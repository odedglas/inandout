import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {NavLink } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DraftsIcon from '@material-ui/icons/CheckBox';
import BudgetsIcon from '@material-ui/icons/AttachMoney';
import CustomersIcon from '@material-ui/icons/Group';
import CalendarIcon from '@material-ui/icons/DateRange';
import HomeIcon from '@material-ui/icons/Home';
import CategoriesIcon from '../../icon/CategoriesIcon';

class ProjectDrawer extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
  };

  state = {
    open: true,
  };

  handleDrawerOpen = () => {
    this.setState({open: true});
  };

  handleDrawerClose = () => {
    this.setState({open: !this.state.open});
  };

  drawerItem = (path, icon, text) => {

    return (
      <ListItem button className={'p-0'}>
        <NavLink activeClassName='is-active' className={'drawer-link'} exact={true} to={path}>
          <ListItemIcon className={'icon'}>
            {icon}
          </ListItemIcon>
          <ListItemText className={'drawer-item-text'} primary={text} />
        </NavLink>
      </ListItem>
    );
  };

  render() {

    const { open } = this.state;
    const { selectedProject } = this.props;
    const drawerClasses = `project-drawer ${!open ? 'collapsed' : ''}`;

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: drawerClasses,
        }}
        open={this.state.open}
      >
        <ListItem button onClick={this.handleDrawerClose}>
          <ListItemIcon>
            {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </ListItemIcon>
        </ListItem>
        <Divider/>
        {this.drawerItem(`/dashboard/project/${selectedProject && selectedProject.identifier}`, <HomeIcon/>, 'Home')}
        {this.drawerItem('/dashboard', <BudgetsIcon/>, 'Budgets')}
        {this.drawerItem('/dashboard', <CategoriesIcon/>, 'Categories')}
        {this.drawerItem('/dashboard', <CustomersIcon/>, 'Customers')}
        {this.drawerItem('/dashboard', <CalendarIcon/>, 'Calendar')}
        {this.drawerItem('/dashboard', <DraftsIcon/>, 'Todo\'s')}
      </Drawer>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(ProjectDrawer);

