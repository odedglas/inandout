import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import {CSSTransition} from 'react-transition-group';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateTransaction from '@modal/CreateTransaction'
import TransactionTableViewHeader from './TransactionTableViewHeader';
import TransactionsTableViewToolbar from './TransactionsTableViewToolbar';
import TransactionFilter from '../filter/TransactionFilter';
import {TransactionType} from "@model/transaction";
import withFilter from '@hoc/withFilter';
import UserAvatar from '@common/UserAvatar';

import util from "@util/"
import {loadTransactions} from "@action/project";
import {setLoading} from "@action/loading";
import {showConfirmation} from "@action/dashboard";
import dateUtil from '@util/date';
import transactionService from '@service/transaction';

const getSorting = (order, orderBy) => {

  const sortProps = [{name: orderBy.prop, reverse: order === 'desc'}];

  return util.sortJsonFN(sortProps)
};

class TransactionsTableView extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    loadTransactions: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    fillTransaction: PropTypes.func.isRequired,
    selectedProject: PropTypes.object,
    projectCurrency: PropTypes.string,
    filter: PropTypes.arrayOf(PropTypes.object).isRequired,
    doFilter: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
  };

  state = {
    order: 'asc',
    orderBy: {id: 'date', prop: 'date'},
    selectedDate: new Date(),
    data: [],
    page: 0,
    rowsPerPage: 5,
    loading: false,
    isEmpty: false,
    showCreateTransactionModal: false,
    transactionForEdit: {},
    transactionActionMap: {},
    showFilter: false
  };

  componentDidMount() {

    const {transactions} = this.props;

    this.setState({
      data: transactions,
      isEmpty: transactions.length === 0
    })
  }

  handleRequestSort = (event, orderBy) => {
    let order = 'desc';

    if (this.state.orderBy.id === orderBy.id && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({order, orderBy});
  };

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
  };

  handleSelectedDateChange = (prev) => {

    const currentDate = this.state.selectedDate;

    let newSelected = dateUtil[prev ? 'prev' : 'next'](currentDate, 'month', 1);

    this.handleTransactionsLoad(newSelected);
  };

  setSelectedForToday = () => {
    this.handleTransactionsLoad(new Date());
  };

  showHideFilter = (show) => this.setState({showFilter: !!show});

  handleTransactionsLoad = (date) => {

    this.setState({loading: true});

    this.props.loadTransactions(date, (transactions) => {

      this.setState({
        selectedDate: date,
        data: transactions,
        loading: false,
        isEmpty: transactions.length === 0,
        page: 0,
      })
    });
  };

  showHideCreateTransaction = (show, transaction) => {

    if (show) {
      this.setState({
        showCreateTransactionModal: true,
        transactionForEdit: transaction || {}
      })
    }
    else {

      this.setState({showCreateTransactionModal: false});
    }

  };

  handleTransactionDelete = (transaction) => {

    const {showConfirmation} = this.props;

    showConfirmation({
      title: 'Delete Transaction ?',
      body: '',
      icon: 'delete',
      onConfirm: () => this.handleTransactionCrud(transaction, 'delete')
    });
  };

  handleTransactionCrud = (transaction, action, cb) => {

    const {selectedProject, fillTransaction, setLoading} = this.props;
    const {selectedDate, transactionForEdit} = this.state;
    let serviceAction, dataManipulation, args;

    const sourceEventId = transactionForEdit.sourceEventId;

    //Casing action in order to prepare operation params
    switch (action) {

      case 'add': {
        serviceAction = 'createTransaction';
        args = [
          'type',
          'owner',
          'description',
          'category',
          'customer',
          'date',
          'amount',
          'payments',
        ];
        dataManipulation = (data, transaction) => {
          if (dateUtil.sameMonth(selectedDate, transaction.date)) {
            data.push(fillTransaction(transaction));
          }
          return data;
        };
        break;
      }
      case 'edit': {
        serviceAction = 'updateTransaction';
        args = [
          'id',
          'type',
          'owner',
          'description',
          'category',
          'customer',
          'date',
          'amount',
          'payments',
          'paymentIndex',
        ];
        dataManipulation = (data, transaction) => {

          if (!dateUtil.sameMonth(selectedDate, transaction.date)) {

            //Transaction no longer on current month, Discarding
            return data.filter(t => t.id !== transaction.id);
          }

          //Else, Editing current record
          return util.updateById(data, fillTransaction(transaction));
        };
        break;
      }
      case 'delete': {
        serviceAction = 'deleteTransaction';
        args = [
          'id',
          'date',
          'payments',
          'paymentIndex',
        ];
        dataManipulation = (data, transaction) => data.filter(t => t.id !== transaction.id);
        break;
      }
      default : {
        break;
      }
    }

    //Starting operation with Backend service action by collected args
    setLoading(true);
    transactionService[serviceAction](selectedProject.id, ...args.map(key => transaction[key]), sourceEventId).then(persisted => {

      if (!dateUtil.sameMonth(persisted.date, selectedDate)) {
        //Meaning we should remove old month entry
        transactionService.deleteTransaction(selectedProject.id, persisted.id, selectedDate)
      }

      const currentTransactions = this.state.data;

      //Setting local component state
      this.setState({
        data: dataManipulation(
          currentTransactions,
          persisted
        )
      });

      //Finally, Triggering callback if sent
      cb && cb();
      setLoading(false);
    })

  };

  render() {
    const {
      data,
      order,
      orderBy,
      rowsPerPage,
      page,
      selectedDate,
      loading,
      isEmpty,
      showCreateTransactionModal,
      transactionForEdit,
      showFilter,
    } = this.state;

    const {selectedProject, filter, handleFilterChange, doFilter} = this.props;

    const filteredData = data.filter(doFilter);
    return (
      <Paper className={'mt-3 row'} style={{position: 'relative'}}>

        <CSSTransition
          in={loading}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className="flex-center grid-loading">
            <CircularProgress size={50}/>
          </div>
        </CSSTransition>
        <TransactionsTableViewToolbar date={selectedDate}
                                      filter={filter}
                                      showFilter={this.showHideFilter}
                                      setSelectedForToday={this.setSelectedForToday}
                                      onSelectedDateChange={this.handleSelectedDateChange}/>
        <div className={'table-view-wrapper col-sm-12 px-0'}>
          <Table aria-labelledby="tableTitle">
            <TransactionTableViewHeader
              order={order}
              projectCurrency={selectedProject.currency}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {filteredData
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(transaction => {

                  return (
                    <TableRow
                      hover
                      onClick={event => {
                      }}
                      tabIndex={-1}
                      key={transaction.id}
                    >
                      <TableCell className={'action-cell'}>
                        <div className={'flex just-c'}>
                          <Tooltip title="Delete" enterDelay={300}>
                            <IconButton className={'action delete'}
                                        onClick={() => {
                                          this.handleTransactionDelete(transaction)
                                        }}>
                              <DynamicIcon name={'delete'}/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" enterDelay={300}>
                            <IconButton className={'action edit'}
                                        onClick={() => {
                                          this.showHideCreateTransaction(true, transaction)
                                        }}>
                              <DynamicIcon name={'edit'}/>
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.formattedDate}
                      </TableCell>
                      <TableCell className={'text-center'}>
                        <UserAvatar user={transaction.owner}
                                    additionalClass={' mb-2'}
                                    style={{ margin: '0 auto'}}
                                    size={'small'} />
                        <div>
                          {transaction.owner.displayName}
                        </div>
                      </TableCell>
                      <TableCell className={'text-center'}>
                        {
                          transaction.customer ? <div>
                            <UserAvatar user={transaction.customer}
                                        additionalClass={' mb-2'}
                                        style={{ margin: '0 auto'}}
                                        size={'small'} />
                            <div>{transaction.customer.name}</div>
                          </div> : null
                        }
                      </TableCell>
                      <TableCell colSpan="2">
                       <span className={'px-3 block'}>
                          {transaction.description}
                        </span>
                      </TableCell>
                      <TableCell numeric>{transaction.amount}</TableCell>
                      <TableCell>
                        <Tooltip title={transaction.income ? 'Income' : 'Outcome'} placement={'top'}>
                          <DynamicIcon className={`icon mx-2 ${transaction.income ? 'income' : 'outcome'}`}
                                       name={transaction.income ? 'income' : 'outcome'}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>{transaction.payments ?
                        `${transaction.paymentIndex + 1} out of ${transaction.payments}` : 'None'}</TableCell>
                      <TableCell className={'text-center'}>
                        {
                          transaction.category ? (
                            <div>
                              <Avatar className={'avatar small mb-2'}
                                      style={{
                                        'backgroundColor': transaction.category.color,
                                        margin: '0 auto'
                                      }}>
                                <DynamicIcon className={'icon'} name={transaction.category.icon}/>
                              </Avatar>
                              <div>{transaction.category.name}</div>
                            </div>
                          ) : null
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}

              {
                isEmpty ? <TableRow key={'empty-row'} className={'empty-row'}>
                  <TableCell colSpan="10">
                    <img src={require('@img/no-results.png')} alt={'no-results'}/>
                    <div>
                      No transactions was found for the selected period.
                      <br/>
                      Try choosing different one...
                    </div>
                  </TableCell>
                </TableRow> : null
              }
            </TableBody>
          </Table>
        </div>
        <div className={'col-sm-12 px-0 row footer'}>
          <Tooltip title="Add Transaction" placement={'left'}>
            <IconButton className={'mx-2 my-1 add-transaction'}
                        onClick={() => this.showHideCreateTransaction(true)}
                        aria-label="Add Transaction">
              <DynamicIcon name={'add'}/>
            </IconButton>
          </Tooltip>
          <div className={'flex'}></div>
          <TablePagination
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>

        <CreateTransaction open={showCreateTransactionModal}
                           transaction={transactionForEdit}
                           showEventLink={true}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={this.showHideCreateTransaction}/>

        <TransactionFilter open={showFilter}
                           filter={filter}
                           handleFilterChange={handleFilterChange}
                           hideFilter={this.showHideFilter}/>
      </Paper>
    );
  }
}

export default compose(
  withFilter([
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
    },
    {
      type: 'date',
      label: 'Date',
      id: 'date',
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject
  }), {
    loadTransactions,
    setLoading,
    showConfirmation
  })
)(TransactionsTableView);