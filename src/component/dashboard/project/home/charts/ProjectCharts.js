import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import ProjectInOutChart from './ProjectInOutChart';
import ProjectExpenseByChart from './ProjectExpenseByChart';
import Button from '@material-ui/core/Button';
import {createTransaction,} from "@action/project";
import CreateTransaction from '@modal/CreateTransaction'
import {ProjectType} from "@model/project";

class ProjectCharts extends React.Component {

  static propTypes = {
    selectedProject: ProjectType,

    createTransaction: PropTypes.func.isRequired,
  };

  state = {
    showCreateTransactionModal: false,
  };

  showHideCreateTransaction = () => {

    this.setState(state => ({
      showCreateTransactionModal: !this.state.showCreateTransactionModal,
    }))
  };

  handleTransactionCrud = (transaction, action, cb) => {

    if(action === 'add') {

      this.props.createTransaction(
        this.props.selectedProject,
        transaction,
        cb
      )
    }
  };

  render() {

    const {showCreateTransactionModal} = this.state;
    const {transactions, categories} = this.props;
    const hasTransactions = transactions.length > 0;

    return (
      <div className={'col-sm-12 px-0 row my-4'}>

        <div className={'col-sm-12 '}>

          {
            hasTransactions ? <Paper className={'project-statistics p-3 row'}>

                <div className={'col-sm-12 px-0 title mb-3'}>
                  Statistics
                </div>
                <div className={'col-sm-11 col-md-9 pr-3'}>
                  <ProjectInOutChart transactions={transactions}/>
                </div>
                <div className={'col-sm-11 mt-sm-3 col-md-3 mt-md-0 px-0'}>
                  <ProjectExpenseByChart transactions={transactions}
                                         categories={categories}/>
                </div>
              </Paper>
              :
              <Paper className={'p-3 project-statistics empty-charts flex-center'}>
                <img src={require('@img/white-page.png')} alt={'no-transactions'}/>

                <div>
                  <div className={'text'}>There are no transactions created under this project just yet</div>
                  <Button className={'mt-3'} color="primary" onClick={this.showHideCreateTransaction}>
                    &#43; Create Transaction
                  </Button>
                </div>

              </Paper>
          }
        </div>

        <CreateTransaction open={showCreateTransactionModal}
                           transaction={{}}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={() => this.showHideCreateTransaction('showCreateTransactionModal')}/>

      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {createTransaction})(ProjectCharts);