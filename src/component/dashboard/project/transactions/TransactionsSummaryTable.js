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

class TransactionsSummaryTable extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    selectedProject: PropTypes.object,
  };

  state = {
    latestTransactions: []
  };

  componentDidMount() {

    const { transactions } = this.props;

    this.setState({
      latestTransactions: transactions.reverse().slice(0, transactions.length > 4 ? 5 : transactions.length)
    })
  }

  render() {

    const { latestTransactions } = this.state;
    const { selectedProject } = this.props;

    return (
      <div className={'row col-sm- px-0'}>
        <div className={'col-sm-12'}>
          <Table className={'transactions-summary'}>
            <TableHead>
              <TableRow className={'table-head'}>
                <TableCell>Date</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell >Description</TableCell>
                <TableCell>Amount ({selectedProject.currency})</TableCell>
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
                    <TableCell>
                        {t.description || ' -- '}
                    </TableCell>
                    <TableCell>
                      <div className={'outcome-amount'}>
                        <span> {t.amount} </span>
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