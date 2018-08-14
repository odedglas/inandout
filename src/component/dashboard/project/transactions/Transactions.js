import React, {Component} from 'react';

import {connect} from 'react-redux';
import TransactionsTableView from './tableview/TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import PageTitle from "@common/PageTitle";
import {ProjectContext} from '../ProjectContext';

class Transactions extends Component {

  render() {

    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id: 'transactionsCrumb', value: 'Transactions'}}/>
        <ProjectContext.Consumer>
          {(projectContext) => (
            <div>
              <PageTitle text={'Transactions'} icon={'transactions'}/>

              <div className={'px-4'}>
                <TransactionsTableView transactions={projectContext.transactions}
                                       fillTransaction={projectContext.fillTransaction}/>
              </div>
            </div>
          )}
        </ProjectContext.Consumer>

      </div>
    );
  }
}

export default connect(null, {})(Transactions);