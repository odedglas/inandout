import React from 'react';

import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import util from '@util/'
import dateUtil from '@util/date'
import {TRANSACTIONS_PAYMENT_METHODS} from '@const/';
import UserAvatar from '@common/UserAvatar';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import CreateTransaction from '@modal/CreateTransaction'
import {
  deleteTransaction,
  updateTransaction
} from "@action/project";

const IncomeRow = {
  amountClass: 'income',
  amountMark: '+',
  paymentText: 'Accepted By',
  title: ({customer}) => customer && customer.name,
  avatar: ({customer}) => {

    const hasCustomer = customer !== undefined;

    return (

      hasCustomer ? <UserAvatar user={customer} size={'medium'}/> :
        <Avatar className={'avatar income-avatar medium'}>
          <DynamicIcon className={'icon'} name={'income'}/>
        </Avatar>

    )
  }
};

const OutcomeRow = {
  amountClass: 'outcome',
  amountMark: '-',
  paymentText: 'Paid by',
  title: ({category}) => category && category.name,
  avatar: ({category}) => (
    <Avatar className={'avatar medium'} style={{'backgroundColor': category.color}}>
      <DynamicIcon className={'icon'} name={category.icon}/>
    </Avatar>
  )
};

class TransactionsList extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      showTransactionModal: false,
      transactionForEdit: {},
    }
  }

  static propTypes = {
    deleteTransaction: PropTypes.func.isRequired,
    updateTransaction: PropTypes.func.isRequired,
    transactions: PropTypes.array,
    project: PropTypes.object,
    current: PropTypes.object
  };

  handleTransactionModalHide = () => this.setState({showTransactionModal: false, transactionForEdit: {}});

  showTransactionModal = (transaction) => this.setState({showTransactionModal: true, transactionForEdit: transaction});

  handleTransactionCrud = (transaction, action, cb) => {

    const {updateTransaction, deleteTransaction, project} = this.props;

    if(action === 'edit') {

      updateTransaction(
        project,
        transaction,
        cb
      );
    }
    else {

      deleteTransaction(
        project,
        transaction,
        cb
      );
    }

  };

  render() {
    const {transactions, currency} = this.props;
    const {showTransactionModal, transactionCreateState, transactionForEdit} = this.state;

    return (
      <div className={'transactions-list'}>
        {
          transactions.map(t => {

            const templateRow = t.income ? IncomeRow : OutcomeRow;
            const paymentMethod = util.getConst(TRANSACTIONS_PAYMENT_METHODS, t.paymentMethod);
            const paidToday = dateUtil.sameDay(t.date, dateUtil.now());

            return (
              <div key={t.id} className={`row px-2 ${t.status.toLowerCase()}`} onClick={() => this.showTransactionModal(t)}>

                <div className={'avatar-container mx-1'}>
                  {
                    templateRow.avatar({
                      category: t.category,
                      customer: t.customer
                    })
                  }
                </div>

                <div className={'flex'}>
                  <div className={'details mx-2 col-flex'}>
                    <div className={'details-title mb-1'}>
                      {
                        templateRow.title({
                          category: t.category,
                          customer: t.customer
                        })
                      }
                    </div>
                    <div> {t.description} </div>
                    <div className={'payment'}> {templateRow.paymentText} {paymentMethod.label} </div>
                  </div>
                  <div className={'details-amount'}>
                    <div>{paidToday ? 'Today' : dateUtil.formatShortDate(t.date)}</div>
                    <div className={`amount ${templateRow.amountClass}`}>
                      {templateRow.amountMark}{util.formatNumber(t.amount, currency)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }

        <CreateTransaction open={showTransactionModal}
                           createInitialState={transactionCreateState}
                           transaction={transactionForEdit}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={this.handleTransactionModalHide}/>
      </div>
    );
  }
}

export default connect(state => ({
  project: state.project.selectedProject
}), {
  deleteTransaction,
  updateTransaction
})(TransactionsList);