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
import Tooltip from '@material-ui/core/Tooltip';

import {TransactionType} from "@model/transaction";
import util from "@util/";
import {CURRENCIES} from "@const/";

class TransactionsSummaryTable extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    selectedProject: PropTypes.object,
  };

  state = {
    latestTransactions: [],
    projectCurrency: undefined
  };

  componentDidMount() {

    const { transactions, selectedProject} = this.props;
    const currency = util.searchInConst(CURRENCIES,selectedProject.currency);

    this.setState({
      latestTransactions: transactions.reverse().slice(0, transactions.length > 4 ? 5 : transactions.length),
      projectCurrency: currency
    })
  }

  render() {

    const { latestTransactions, projectCurrency } = this.state;

    return (
      <div className={'row col-sm-12'}>
        <div className={'col-sm-12'}>
          <Table className={'transactions-summary'}>
            <TableHead>
              <TableRow className={'table-head'}>
                <TableCell>Date</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell style={{flex:3}}>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestTransactions.map(t => {

                const avatarBackground = {
                  'backgroundColor' : t.owner.avatarColor
                };

                return (
                  <TableRow key={t.id} className={'table-row'}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>
                      <Tooltip title={t.owner.displayName} placement={'right'}>
                        <Avatar className={'avatar small'}
                                style={avatarBackground}>
                          {t.owner.initials}
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                    <TableCell style={{flex:3}}>
                      <span>
                        {t.description || ' -- '}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={'outcome-amount'}>
                        <span> {` ${projectCurrency} ${t.amount}`} </span>
                        <Tooltip title={'Outcome'} placement={'top'}>
                          <DynamicIcon className={'icon mx-2'} name={'outcome'}/>
                        </Tooltip>
                      </div>
                      </TableCell>
                    <TableCell>
                      <Tooltip title={t.category.name} placement={'right'}>
                        <Avatar className={'avatar small'} style={{'backgroundColor': t.category.color}}>
                          <DynamicIcon className={'icon'} name={t.category.icon}/>
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(TransactionsSummaryTable);