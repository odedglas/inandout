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

import TodosIcon from '@material-ui/icons/CheckBox';
import BudgetsIcon from '@material-ui/icons/AttachMoney';
import TransactionsIcon from '@material-ui/icons/Transform';
import CustomersIcon from '@material-ui/icons/Group';
import CalendarIcon from '@material-ui/icons/DateRange';
import HomeIcon from '@material-ui/icons/Home';
import CategoriesIcon from '../../icon/CategoriesIcon';

import navigationUtil from '@util/navigation'

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

    const selectedProject = this.props.selectedProject;

    const fullPath = selectedProject ? navigationUtil.projectLink(
      selectedProject,
      path
    ) : path;

    console.log("Full path is : " + fullPath);

    return (
      <ListItem button className={'p-0'}>
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

    const { open } = this.state;
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

        {this.drawerItem(``, <HomeIcon/>, 'Home')}
        {this.drawerItem('budgets', <BudgetsIcon/>, 'Budgets')}
        {this.drawerItem('transactions', <TransactionsIcon/>, 'Transactions')}
        {this.drawerItem('categories', <CategoriesIcon/>, 'Categories')}
        {this.drawerItem('customers', <CustomersIcon/>, 'Customers')}
        {this.drawerItem('calendar', <CalendarIcon/>, 'Calendar')}
        {this.drawerItem('todos', <TodosIcon/>, 'Todo\'s')}
      </Drawer>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
  }), {})
)(ProjectDrawer);