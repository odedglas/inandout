import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';


const budgets = [
  {
    name: 'Home expenses',
    categories:['-LGJxyxcd2of6FONr-uD', '-LGJxyxeeazW-JcjkT-s'],
    limit: 1200,
    warningLimit: 440,
  }
];

class Budgets extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  render() {
    const { selectedProject } = this.props;

    return (
      <div className={'welcome-container'}>
        <Breadcrumb item={{id:'budgetsCrumb' ,value:'Budgets', path:'/dashboard'}}/>

        I R Budgets for { selectedProject.name }
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(Budgets);