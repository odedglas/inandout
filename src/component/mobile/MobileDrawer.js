import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import UserAvatar from '@common/UserAvatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DynamicIcon from '@common/DynamicIcon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import FeedbackIcon from '@material-ui/icons/Feedback';
import {toggleProjectDrawer, selectProject} from '@action/project';

class MobileDrawer extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    toggleProjectDrawer: PropTypes.func.isRequired,
  };

  state = {
    projectsExpanded: false
  };

  handleDrawerToggle = () => {

    const newOpenState = !this.props.open;

    this.props.toggleProjectDrawer(newOpenState);
  };

  drawerProjectItemClick = (projectId) => {

    const project = this.props.projects.find(p => p.id === projectId);

    this.props.selectProject(project);
    this.toggleProjects();
    this.handleDrawerToggle();
  };

  toggleProjects = () => {
    const newOpenState = !this.state.projectsExpanded;

    this.setState({projectsExpanded: newOpenState});
  };

  render() {

    const {open, user, selectedProject, projects} = this.props;
    const {projectsExpanded} = this.state;
    const drawer = ( <div>
        <div className={'user-header'}>
          <div className={'flex'}>
            <div className={'user-image'}>
              <UserAvatar user={user} size={'x-large'}/>
            </div>
            <div className={'details mx-3'}>
              <h3> {user.displayName} </h3>
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <Divider/>

        <ListItem button onClick={this.toggleProjects}>
          <ListItemIcon>
            <DynamicIcon name={'projects'}/>
          </ListItemIcon>
          <ListItemText inset primary="Projects"/>
          {projectsExpanded ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
        <Collapse in={projectsExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {projects.map(project => (
              <ListItem className={`${selectedProject.id === project.id ? 'active' : ''}`} key={project.id}
                        onClick={() => this.drawerProjectItemClick(project.id)}
                        button>
                <ListItemText inset primary={project.name}/>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem button onClick={this.handleDrawerToggle}>
          <ListItemIcon className={'menu-icon'}>
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText className={'menu-text'} primary="Settings"/>
        </ListItem>

        <ListItem button onClick={this.handleDrawerToggle}>
          <ListItemIcon className={'menu-icon'}>
            <FeedbackIcon/>
          </ListItemIcon>
          <ListItemText className={'menu-text'} primary="Feedback"/>
        </ListItem>

        <ListItem button onClick={this.handleDrawerToggle}>
          <ListItemIcon className={'menu-icon'}>
            <HelpIcon/>
          </ListItemIcon>
          <ListItemText className={'menu-text'} primary="Help"/>
        </ListItem>

        <ListItem button onClick={this.handleDrawerToggle}>
          <ListItemIcon className={'menu-icon'}>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText className={'menu-text'} primary="Logout"/>
        </ListItem>

      </div>
    );

    return (
      <SwipeableDrawer
        variant="temporary"
        anchor={'left'}
        open={open}
        onOpen={this.handleDrawerToggle}
        onClose={this.handleDrawerToggle}
        classes={{
          paper: 'project-drawer mobile',
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </SwipeableDrawer>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    user: state.user,
    projects: state.projects,
    open: state.project.drawerOpen,
  }), {toggleProjectDrawer, selectProject})
)(MobileDrawer);