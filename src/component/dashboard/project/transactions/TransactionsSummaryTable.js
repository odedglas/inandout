import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import UserAvatar from '@common/UserAvatar';
import Tooltip from '@material-ui/core/Tooltip';

import {TransactionType} from "@model/transaction";

class TransactionsSummaryTable extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    selectedProject: PropTypes.object,
    showIncomes: PropTypes.bool,
    transactionsAmount: PropTypes.number,
    emptyMessage: PropTypes.string,
  };

  static defaultProps = {
    showIncomes: false,
    transactionsAmount: 5,
    emptyMessage: 'There are no transactions for display'
  };

  render() {

    const {selectedProject, transactions, emptyMessage, showIncomes, transactionsAmount} = this.props;
    const isEmpty = transactions.length === 0;

    const latestTransactions = transactions.reverse()
      .filter(t => t.income === showIncomes)
      .slice(0, transactions.length > transactionsAmount - 1 ? transactionsAmount : transactions.length);

    return (
      <div className={'row col-sm-12 px-0'}>
        <div className={'col-sm-12'}>
          {
            !isEmpty ? <Table className={'transactions-summary'}>
              <TableHead>
                <TableRow className={'table-head'}>
                  <TableCell>Date</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount ({selectedProject.currency})</TableCell>
                  <TableCell>{showIncomes ? 'Customer' : 'Category'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestTransactions.map(t => {

                  return (
                    <TableRow key={t.id} className={'table-row'}>
                      <TableCell>{t.formattedDate}</TableCell>
                      <TableCell>
                        <Tooltip title={t.owner.displayName} placement={'right'}>
                          <UserAvatar user={t.owner} size={'smaller'}/>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {t.description}
                      </TableCell>
                      <TableCell>
                        <div className={'outcome-amount'}>
                          <span> {t.amount} </span>
                          <Tooltip title={showIncomes ? 'Income' : 'Outcome'} placement={'top'}>
                            <DynamicIcon
                              className={`icon mx-2 ${showIncomes ? 'success-indicator' : 'overage-indicator'}`}
                              name={showIncomes ? 'income' : 'outcome'}/>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {
                          showIncomes ?
                            (t.customer ? <Tooltip title={t.customer.name} placement={'right'}>
                              <UserAvatar user={t.customer} size={'smaller'}/>
                            </Tooltip> : null)
                            :
                            (t.category ? <Tooltip title={t.category.name} placement={'right'}>
                              <Avatar className={'avatar smaller'} style={{'backgroundColor': t.category.color}}>
                                <DynamicIcon className={'icon'} name={t.category.icon}/>
                              </Avatar>
                            </Tooltip> : null)
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table> : <div className={'p-4'}> {emptyMessage} </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(TransactionsSummaryTable);