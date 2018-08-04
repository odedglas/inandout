import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';

import InputAdornment from '@material-ui/core/InputAdornment'
import withValidation from '../hoc/withValidation';
import CreationModal from './CreationModal';

import util from '@util/';
import {TRANSACTIONS_TYPE} from '@const/';
import CategoriesSelect from '@common/CategoriesSelect';
import CustomersSelect from '@common/CustomersSelect';
import DatePicker from 'material-ui-pickers/DatePicker';
import variables from '@scss/_variables.scss';

class CreateTransactionModal extends React.Component {

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
  };

  handleTransactionCreate = (model, close) => {

    const {transaction, transactionCrudHandler, currentUser} = this.props;
    const {type, owner, description, category, customer, date, amount, payments} = model;

    const editMode = !util.isEmptyObject(transaction);

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
        id: editMode ? transaction.id : undefined
      },
      editMode ? 'edit' : 'add',
      close
    );

  };

  modalContent = (model, validation, handleChange, editMode) => {

    const {selectedProject} = this.props;

    const isIncome = model.type === 'INCOME';
    const paymentsEditMode = !!model.payments && editMode;

    //Adjusting amount if it's edit mode and payment type transaction
    const amount = paymentsEditMode ? Math.round(model.amount * model.payments) : model.amount;

    return (
      <div>
        {
          !editMode ? <div className={'form-control'}>
              <TextField
                select
                autoFocus
                fullWidth
                placeholder={'Please set transaction type'}
                label="Transaction Type"
                value={model.type}
                onChange={(event) => handleChange(event.target.value, 'type')}
              >
                {TRANSACTIONS_TYPE.map(option => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div> :
            null
        }

        {
          !isIncome ? <CategoriesSelect selectedCategories={model.category}
                                        error={validation.category.isInvalid}
                                        multi={false}
                                        onChange={(val) => handleChange(val, 'category')}/>
            :
            <CustomersSelect customer={model.customer}
                             showCreateNewCustomer={true}
                             onChange={(val) => handleChange(val, 'customer')}/>
        }

        <div className={'form-control'} style={{flexDirection: 'column'}}>
          <TextField
            value={amount}
            error={validation.amount.isInvalid}
            placeholder={"Amount"}
            onChange={(event) => {
              const value = event.target.value;
              const calcValue = paymentsEditMode ? value / model.payments : value;
              handleChange(calcValue, 'amount')
            }}
            margin="dense"
            id="amount"
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
          {
            paymentsEditMode ? <FormHelperText>
              This transaction is {model.paymentIndex + 1} of {model.payments} Payments of {model.amount.toFixed(
              2)}{selectedProject.currency}
            </FormHelperText> : null
          }
        </div>

        <div className={'form-control'}>
          <DatePicker
            value={model.date || new Date()}
            disabled={paymentsEditMode}
            className={'flex mt-2'}
            onChange={(date) => {
              handleChange(date.toDate().getTime(), 'date')
            }}
          />
        </div>

        {!editMode && !isIncome ?
          <div className={'form-control'} style={{flexDirection: 'column'}}>
            <TextField
              label="Payments"
              value={model.payments}
              title={validation.payments.message}
              error={validation.payments.isInvalid}
              placeholder={"Payments"}
              onChange={(event) => handleChange(event.target.value, 'payments')}
              fullWidth
              margin="dense"
            />
            <FormHelperText> Number of monthly payments </FormHelperText></div> : null
        }

        <div className={'form-control'}>

          <TextField
            label="Description"
            value={model.description}
            error={validation.description.isInvalid}
            placeholder={"Description"}
            multiline
            rowsMax="4"
            onChange={(event) => handleChange(event.target.value, 'description')}
            fullWidth
            margin="dense"
          />

        </div>

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
      transaction
    } = this.props;

    const editMode = !util.isEmptyObject(transaction);
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
                     title={editMode ? 'Edit Transaction' : 'Create Transaction'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       type: 'OUTCOME',
                       owner: '',
                       category: '',
                       customer: '',
                       date: '',
                       payments: '',
                       amount: '',
                       editMode: false,
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
      method: (v, f, state, validator, args) =>  state.type === 'INCOME' ? validator.isEmpty(v) : !validator.isEmpty(v),
      message: 'Please select transaction category'
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
