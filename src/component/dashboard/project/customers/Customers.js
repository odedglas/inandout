import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';

class Customers extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  render() {

    const { selectedProject } = this.props;

    return (
      <div className={'welcome-container'}>
        <Breadcrumb item={{id:'customersCrumb' ,value:'Customers', path:'/dashboard'}}/>

        I R Customers for { selectedProject.name }
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(Customers);