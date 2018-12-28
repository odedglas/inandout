import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import InputAdornment from '@material-ui/core/InputAdornment'
import withValidation from '../hoc/withValidation';
import CreationModal from './CreationModal';
import Hidden from '@material-ui/core/Hidden';
import util from '@util/';
import dateUtil from '@util/date';
import navigationUtil from '@util/navigation';
import {TRANSACTIONS_TYPE, TRANSACTIONS_PAYMENT_METHODS, TRANSACTIONS_STATUS} from '@const/';
import CategoriesSelect from '@common/CategoriesSelect';
import CustomersSelect from '@common/CustomersSelect';
import {DatePicker} from 'material-ui-pickers';
import variables from '@scss/_variables.scss';
import DynamicIcon from "@common/DynamicIcon";

class CreateTransactionModal extends React.Component {

  constructor(props) {
    super(props);
    this.datePicker = React.createRef();
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    transactionCrudHandler: PropTypes.func.isRequired,
    transaction: PropTypes.object,
    createInitialState: PropTypes.object,
    showEventLink: PropTypes.bool,
  };

  state = {
    transactionTypeMenuAnchor: null,
    statusTypeMenuAnchor: null,
  };

  static defaultProps = {
    createInitialState: {}
  };

  handleTransactionCreate = (model, close) => {

    const {transaction, transactionCrudHandler, currentUser} = this.props;
    const {type, owner, description, category, customer, date, amount, payments, paymentMethod, status} = model;

    const editMode = !util.isUndefined(transaction.id);

    //Triggering Create / Edit
    transactionCrudHandler(
      {
        type,
        owner: owner || currentUser,
        category,
        description,
        customer,
        date: date,
        amount,
        payments,
        paymentIndex: transaction.paymentIndex,
        paymentMethod,
        status,
        id: editMode ? transaction.id : undefined
      },
      editMode ? 'edit' : 'add',
      close
    );

  };

  gotoTransactionEvent = () => {

    const {history, selectedProject, transaction, onClose} = this.props;

    history.push({
      pathname: navigationUtil.projectLink(selectedProject, 'calendar'),
      state: {
        selectedEventId: transaction.sourceEventId,
        date: transaction.date
      }
    });
    onClose();
  };

  handleTransactionTypeMenuShowHide = event => {
    this.setState({transactionTypeMenuAnchor: event ? event.currentTarget : null});
  };

  handleTransactionStatusMenuShowHide = event => {

    this.setState({statusTypeMenuAnchor: event ? event.currentTarget : null});
  };

  showDatePicker = () => {
    this.datePicker.open()
  };

  modalContent = (model, validation, handleChange, editMode) => {

    const {transactionTypeMenuAnchor, statusTypeMenuAnchor} = this.state;
    const {selectedProject, showEventLink} = this.props;

    const isIncome = model.type === 'INCOME';
    const paymentsEditMode = !!model.payments && editMode;
    const hasEventSource = !util.isEmpty(this.props.transaction.sourceEventId);

    //Adjusting amount if it's edit mode and payment type transaction
    const amount = paymentsEditMode ? Math.round(model.amount * model.payments) : model.amount;

    const selectedTransactionType = TRANSACTIONS_TYPE.find(item => item.key === model.type);
    const transactionStatus = TRANSACTIONS_STATUS.find(item => item.key === (model.status || 'ACCEPTED'));

    const isCheckMethod = model.paymentMethod === 'CREDIT';
    const isToday = dateUtil.dayDiff(new Date(), model.date) !== 0;
    const datePickerDisabled = paymentsEditMode || hasEventSource;

    return (
      <div className={'py-3 px-4'}>

        <div className={'transaction-create-topbar mb-2'}>

          <Chip aria-owns={transactionTypeMenuAnchor ? 'transaction-type-menu' : null}
                onClick={this.handleTransactionTypeMenuShowHide}
                aria-haspopup="true"
                avatar={
                  <Avatar>
                    <DynamicIcon name={selectedTransactionType.icon} className={selectedTransactionType.icon}/>
                  </Avatar>
                }
                label={selectedTransactionType.label}/>
          <Menu
            id="transaction-type-menu"
            anchorEl={transactionTypeMenuAnchor}
            open={Boolean(transactionTypeMenuAnchor)}
            onClose={() => this.handleTransactionTypeMenuShowHide()}>

            {TRANSACTIONS_TYPE.map(option => (
              <MenuItem key={option.key}
                        className={'transaction-type-menu-item'}
                        value={option.key} onClick={() => {
                handleChange(option.key, 'type');
                this.handleTransactionTypeMenuShowHide()
              }}>
                <DynamicIcon name={option.icon} className={option.icon}/>
                {option.label}
              </MenuItem>
            ))}
          </Menu>

          <Hidden smDown>
            <div className={'flex'}/>
          </Hidden>

          <div className={'mr-4'}
               aria-owns={statusTypeMenuAnchor ? 'transaction-status-menu' : null}
               onClick={this.handleTransactionStatusMenuShowHide}
               aria-haspopup="true">
            <div className={`status-indicator  ${transactionStatus.className}`}>
              <span> </span>
              {transactionStatus.label}
            </div>
          </div>
          <Menu
            id="transaction-status-menu"
            anchorEl={statusTypeMenuAnchor}
            open={Boolean(statusTypeMenuAnchor)}
            onClose={() => this.handleTransactionStatusMenuShowHide()}>

            {TRANSACTIONS_STATUS.map(option => (
              <MenuItem key={option.key}
                        value={option.key}
                        onClick={e => {
                          handleChange(e.target.getAttribute('value'), 'status');
                          this.handleTransactionStatusMenuShowHide();
                        }}>
                {option.label}
              </MenuItem>
            ))}
          </Menu>
          <div className={'date-picker'}>
            <div className={`date-picker-trigger ${validation.date.isInvalid ? 'error' : ''} ${datePickerDisabled ?
              'disabled' : ''}`}
                 onClick={() => !datePickerDisabled && this.showDatePicker()}>
              <DynamicIcon name={'calendar'}/>
              <span>{isToday ? dateUtil.format(model.date, 'MMM Do') : 'Today'}</span>
            </div>
            <DatePicker
              ref={(node) => {
                this.datePicker = node;
              }}
              value={model.date}
              className={'date-control'}
              autoOk={true}
              onChange={(date) => {
                handleChange(date.toDate().getTime(), 'date');
              }}
            />
          </div>
        </div>

        <div className={'form-control row'}>
          <div className={'col-6 col-sm-8 col-md-8 px-0'} style={{flexDirection: 'column'}}>
            <TextField
              value={amount}
              autoFocus
              error={validation.amount.isInvalid}
              onChange={(event) => {
                const value = event.target.value;
                const calcValue = paymentsEditMode ? value / model.payments : value;
                handleChange(calcValue, 'amount')
              }}
              label={`Amount (${selectedProject.currency})`}
              title={validation.amount.message}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">
                <span style={{
                  color: isIncome ? variables.successColor : variables.errorColor,
                  fontSize: '1.25rem'
                }}>
                  {isIncome ? '+' : '-'}
                </span>
                </InputAdornment>,
              }}
            />
          </div>
          <div className={'col-6 col-sm-4 col-md-4 px-0'}>
            <TextField
              select
              className={'payment-method'}
              value={model.paymentMethod || 'CREDIT'}
              label="Method"
              SelectProps={{
                renderValue: selected => {
                  let method = TRANSACTIONS_PAYMENT_METHODS.find(m => m.key === selected);
                  return (
                    method ? <div className={'display'}>
                      <DynamicIcon name={method.icon} className={'icon'}/>
                      <span>{method.label}</span>
                    </div> : ''
                  )
                }
              }}
              onChange={(e) => {
                handleChange(e.target.value, 'paymentMethod');
              }}>
              {
                TRANSACTIONS_PAYMENT_METHODS.map(method => (
                  <MenuItem key={method.key} value={method.key} className={'select-menu-item'}>
                    <DynamicIcon name={method.icon} className={'icon'}/>
                    {method.label}
                  </MenuItem>
                ))
              }
            </TextField>
          </div>
          {
            paymentsEditMode ? <FormHelperText>
              This transaction is {model.paymentIndex + 1} of {model.payments} Payments of <b> {model.amount.toFixed(2)}{selectedProject.currency} </b>
            </FormHelperText> : null
          }
        </div>

        {
          !isIncome ? <CategoriesSelect selectedCategories={model.category}
                                        error={validation.category.isInvalid}
                                        multi={false}
                                        onChange={(val) => handleChange(val, 'category')}/>
            :
            <CustomersSelect customer={model.customer}
                             showCreateNewCustomer={true}
                             disabled={hasEventSource}
                             onChange={(val) => handleChange(val, 'customer')}/>
        }

        <div className={'form-control'}>

          <TextField
            label="Description"
            value={model.description}
            error={validation.description.isInvalid}
            disabled={hasEventSource}
            placeholder={"Description"}
            multiline
            rowsMax="4"
            onChange={(event) => handleChange(event.target.value, 'description')}
            fullWidth
          />

        </div>

        {
          hasEventSource && showEventLink ? <div className={'event-source-link mb-2'}>
            * Please not that this transaction is controlled by calendar <span className={'link'}> <a
            onClick={this.gotoTransactionEvent}> Event </a> </span>
          </div> : null
        }

        {(!editMode && !isIncome && isCheckMethod )?
          <div className={'form-control'} style={{flexDirection: 'column'}}>
            <TextField
              label="Payments"
              value={model.payments}
              title={validation.payments.message}
              error={validation.payments.isInvalid}
              placeholder={"Payments"}
              onChange={(event) => handleChange(event.target.value, 'payments')}
              fullWidth
            />
            <FormHelperText> Number of monthly payments </FormHelperText></div> : null
        }
      </div>
    );
  };

  render() {

    const {
      open,
      validation,
      clearValidation,
      validate,
      onClose,
      onValidationChange,
      transaction,
      createInitialState
    } = this.props;

    const editMode = !util.isUndefined(transaction.id);
    let model = {};

    if (editMode) {

      model = {
        ...transaction,
        payments: transaction.payments ? transaction.payments : '',
        category: transaction.category ? transaction.category.id : '',
        customer: transaction.customer ? transaction.customer.id : '',
      }
    }

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     mainClass={'transaction-modal'}
                     title={editMode ? 'Edit Transaction' : 'Create Transaction'}
                     editMode={editMode}
                     noPadding={true}
                     model={model}
                     getInitialState={() => ({
                       ...{
                         type: 'OUTCOME',
                         owner: '',
                         category: '',
                         customer: '',
                         date: dateUtil.now(),
                         payments: '',
                         amount: '',
                         paymentMethod: 'CREDIT',
                         status: 'ACCEPTED',
                         editMode: false,
                       },
                       ...createInitialState
                     })}
                     renderContent={this.modalContent}
                     onCreate={this.handleTransactionCreate}
                     validate={validate}
                     validation={validation}
                     onValidationChange={onValidationChange}
                     clearValidation={clearValidation}/>
    );
  }
}

export default compose(
  withRouter,
  withValidation([
    {
      field: 'category',
      method: (v, f, state, validator, args) => state.type === 'INCOME' ? validator.isEmpty(v) : !validator.isEmpty(v),
      message: 'Please select transaction category'
    },
    {
      field: 'date',
      method: (v, f, state, validator, args) => v && validator.positiveNumber(v, validator),
      message: 'Please select transaction date'
    },
    {
      field: 'amount',
      method: (v, f, state, validator, args) => validator.positiveNumber(v, validator),
      message: 'Please enter a valid amount'
    },
    {
      field: 'description',
      method: (v, f, state, validator, args) => true,
    },
    {
      field: 'payments',
      method: (v, f, state, validator, args) => {
        v += '';
        return validator.isEmpty(v) || validator.positiveNumber(v, validator);
      },
      message: 'Please enter valid payments number (greater than 0)'
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject,
    currentUser: state.user
  }), {})
)(CreateTransactionModal);
