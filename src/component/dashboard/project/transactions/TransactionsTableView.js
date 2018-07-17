import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import {TransactionType} from "@model/transaction";

import util from "@util/"
import transactionService from '@service/transaction';
import dateUtil from '@util/date';

function getSorting(order, orderBy) {

  const sortProps = [{name: orderBy.prop, reverse: order === 'desc'}];

  return util.sortJsonFN(sortProps)
}

class TableHeader extends Component {

  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    projectCurrency: PropTypes.string,
    orderBy: PropTypes.object.isRequired,
  };

  createSortHandler = column => event => {
    this.props.onRequestSort(event, {
      id: column.id,
      prop: column.orderByProp ? column.orderByProp : column.id
    });
  };

  render() {
    const {order, orderBy, projectCurrency} = this.props;

    const columnData = [
      {id: 'actions', sortable:false, additionalCls: 'action-cell'},
      {id: 'date', label: 'Date'},
      {id: 'owner', label: 'Owner', avatar: true, orderByProp: 'owner.displayName'},
      {id: 'description', label: 'Description'},
      {id: 'amount', numeric: true, label: `Amount (${projectCurrency})`},
      {id: 'type', label: 'Type', additionalCls: 'small-cell', orderByProp: 'income'},
      {id: 'payments', label: 'Payments'},
      {id: 'customer', label: 'Customer', avatar: true,},
      {id: 'category', label: 'Category', avatar: true, orderByProp: 'category.name'},
    ];

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                className={`${column.additionalCls ? column.additionalCls : ''} ${column.avatar ? 'avatar-header' :
                  ''}`}
                sortDirection={orderBy.id === column.id ? order : false}
              >
                {
                  column.sortable !== false ? <TableSortLabel
                    active={orderBy.id === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column)}
                  >
                    {column.label}
                  </TableSortLabel> : <div> {column.label} </div>
                }

              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

let TransactionsToolbar = ({ date, onSelectedDateChange }) => {
  return (
    <Toolbar className={'transaction-toolbar col-sm-12'}>
      <div className={'title'}>
        <Typography variant="title" id="tableTitle">
          Transactions -
        </Typography>
      </div>
      <div className={'months-navigator mx-2'}>
        <span className={'selected-month'}>
          {dateUtil.format(date, 'MMM YYYY')}
        </span>
        <Tooltip title="Previous Month" enterDelay={300}>
          <IconButton className={'icon-button ml-2'}
                      aria-label="Previous Month"
                      size={'small'}
                      onClick={() => onSelectedDateChange(true)}>
            <DynamicIcon name={'left'}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Month" enterDelay={300}>
          <IconButton className={'icon-button'}
                      onClick={() => onSelectedDateChange(false)}
                      aria-label="Next Month"
                      size={'small'}>
            <DynamicIcon name={'right'}/>
          </IconButton>
        </Tooltip>
      </div>
      <div className={'spacer'}/>
      <div className={'action'}>
        <Tooltip title="Filter List">
          <IconButton aria-label="Filter List">
            <FilterListIcon/>
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

class TransactionsTableView extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    projectCurrency: PropTypes.string,
  };

  state = {
    order: 'asc',
    orderBy: {id: 'date', prop: 'date'},
    selectedDate: new Date(),
    data: [],
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount() {
    this.setState({data: this.props.transactions});
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

    this.setState({
      selectedDate: dateUtil[prev ? 'prev' : 'next'](currentDate, 'month', 1)
    })
  };

  render() {
    const {data, order, orderBy, rowsPerPage, page, selectedDate} = this.state;
    const {projectCurrency} = this.props;

    return (
      <Paper className={'mt-3 row'}>
        <TransactionsToolbar date={selectedDate} onSelectedDateChange={this.handleSelectedDateChange}/>
        <div className={'table-view-wrapper col-sm-12 px-0'}>
          <Table aria-labelledby="tableTitle">
            <TableHeader
              order={order}
              projectCurrency={projectCurrency}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data
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
                           <IconButton className={'action'}
                                       onClick={() => {}}>
                             <DynamicIcon name={'delete'}/>
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Edit" enterDelay={300}>
                           <IconButton className={'action ml-2'}
                                       onClick={() => {}}>
                             <DynamicIcon name={'edit'}/>
                           </IconButton>
                         </Tooltip>
                       </div>
                      </TableCell>
                      <TableCell>
                        {transaction.date}
                      </TableCell>
                      <TableCell className={'text-center'}>
                        <Avatar className={'avatar small mb-2'}
                                style={{backgroundColor: transaction.owner.avatarColor, margin: '0 auto'}}>
                          {transaction.owner.initials}
                        </Avatar>
                        <div>
                          {transaction.owner.displayName}
                        </div>
                      </TableCell>
                      <TableCell>
                       <span>
                          {transaction.description || ' -- '}
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
                      <TableCell>{transaction.payment ? transaction.payment : 'None'}</TableCell>
                      <TableCell>{transaction.customer && transaction.customer.displayName}</TableCell>
                      <TableCell className={'text-center'}>
                        {
                          transaction.category.id ? <Avatar className={'avatar small mb-2'}
                                                            style={{
                                                              'backgroundColor': transaction.category.color,
                                                              margin: '0 auto'
                                                            }}>
                            <DynamicIcon className={'icon'} name={transaction.category.icon}/>
                          </Avatar> : null
                        }
                        <div>{transaction.category.name}</div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <div className={'col-sm-12 px-0 row footer'}>
          <Tooltip title="Add Transaction" placement={'left'}>
            <IconButton className={'mx-3 my-1 add-transaction'} aria-label="Add Transaction">
              <DynamicIcon name={'add'}/>
            </IconButton>
          </Tooltip>
          <div className={'flex'}></div>
          <TablePagination
            component="div"
            count={data.length}
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
      </Paper>
    );
  }
}

export default TransactionsTableView;
