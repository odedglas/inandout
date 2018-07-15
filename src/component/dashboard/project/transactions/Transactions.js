import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import TransactionsTableView from './TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

class Transactions extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  render() {
    const { selectedProject } = this.props;

    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id:'transactionsCrumb' ,value:'Transactions', path:'/dashboard'}}/>

        <TransactionsTableView />
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(Transactions);