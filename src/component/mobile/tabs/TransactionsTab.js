import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import TransactionsList from '../lists/TransactionsList';
import TransactionFilter from '@modal/TransactionFilter';
import withFilter from '@hoc/withFilter';

import util from '@util/';
import {TRANSACTIONS_PAYMENT_METHODS} from '@const/';

class TransactionsTab extends React.Component {

  state = {
    showFilter: false,
  };

  showHideFilter = (show) => this.setState({showFilter: !!show});

  render () {

    const { transactions, filter, project, handleFilterChange, doFilter } = this.props;
    const { showFilter } = this.state;

    const hasFilter = filter.some(f => !util.isEmptyObject(f.value));

    return (
      <div className={'tab transactions-tab row'}>
        <IconButton aria-label="Filter List" className={`filter ${hasFilter ? 'active' : ''}`} onClick={() => this.showHideFilter(true)}>
          <FilterListIcon/>
        </IconButton>

        <div className={'col-12 px-0 transactions-wrapper'}>
          <TransactionsList transactions={transactions.filter(doFilter)}
                            currency={project.currency}/>
          <TransactionFilter open={showFilter}
                             filter={filter}
                             handleFilterChange={handleFilterChange}
                             hideFilter={this.showHideFilter}/>
        </div>
      </div>
    );
  }
}

export default withFilter([
  {
    type: 'string',
    label: 'Description',
    id: 'description',
  },
  {
    type: 'number',
    label: 'Amount',
    id: 'amount',
  },
  {
    type: 'select',
    label: 'Owner',
    id: 'owner',
    getFieldValue: (data) => data.owner.id
  },
  {
    type: 'select',
    label: 'Category',
    id: 'category',
    getFieldValue: (data) => data.category ? data.category.id : null
  },
  {
    type: 'singleSelect',
    label: 'Type',
    id: 'type',
  },
  {
    type: 'select',
    label: 'Customer',
    id: 'customer',
    getFieldValue: (data) => data.customer && data.customer.id
  },
  {
    type: 'date',
    label: 'Date',
    id: 'date',
  },
  {
    type: 'singleSelect',
    label: 'Status',
    id: 'status',
  },
  {
    type: 'singleSelect',
    label: 'Payment Method',
    id: 'paymentMethod',
  },
])(TransactionsTab);