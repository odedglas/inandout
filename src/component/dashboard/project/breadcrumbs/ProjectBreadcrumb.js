import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import navigationUtil from '@util/navigation'
import {ROUTER} from '@const/'
import {selectProject} from "@action/project";

class ProjectBreadCrumb extends React.Component {

  static propTypes = {
    selectedProjectId: PropTypes.string,
    projects: PropTypes.array.isRequired,
    selectProject: PropTypes.func.isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  handleItemClick = (id) => {

    this.handleClose();
    const project = this.props.projects.filter(p => p.id === id)[0];
    this.props.selectProject(project);
    this.props.history.push(
      navigationUtil.projectLink(project)
    );
  };

  viewAllProjects = () => {

    this.handleClose();
    this.props.history.push(ROUTER.DASHBOARD);
  };

  render() {

    const {selectedProjectId, projects} = this.props;
    const {anchorEl} = this.state;

    //Removing current project from list
    //TODO -> Should this be moved into redux connected ?
    const selectedProject = projects.find(p => p.id === selectedProjectId) || {};
    const _projects = projects.filter(p => p.id !== selectedProjectId);

    return (
      <div className={'project-breadcrumb'}>
        <span aria-owns={anchorEl ? 'projects-menu' : null}
              aria-haspopup="true"
              className={'menu-trigger'}
              onClick={this.handleClick}>
          <span className={'description'}> Project: </span>
          <span className={' value pl-2'}> {selectedProject.name} </span>
        </span>
        <Menu
          id="projects-menu"
          className={'projects-menu'}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem className={'menu-item'}
                    onClick={this.handleClose}>
            <ListItemText className={' active'}
                          primary={selectedProject.name}
                          secondary={'id: ' + selectedProject.identifier}/>
          </MenuItem>
          {
            _projects.map(project =>
              <MenuItem key={project.id} onClick={() => this.handleItemClick(project.id)}>
                <ListItemText primary={project.name}
                              secondary={'id: ' + project.identifier}/>
              </MenuItem>
            )
          }
          <Divider/>
          <MenuItem onClick={this.viewAllProjects}>See all projects</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    projects: state.project.projects,
  }), {selectProject})
)(ProjectBreadCrumb);