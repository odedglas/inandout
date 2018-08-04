import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateCustomer from '@modal/CreateCustomer'
import DynamicIcon from "@common/DynamicIcon";

import {CustomerType} from "@model/customer";

const MenuProps = {
  PaperProps: {
    style: {
      transform: 'translate3d(0, 0, 0)',
      maxHeight: 300,
      width: 250,
    },
  },
};

class CustomersSelect extends Component {

  static propTypes = {
    customer: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    customers: PropTypes.arrayOf(CustomerType),
    selectedProject: PropTypes.object,
    helperText: PropTypes.string,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    showCreateNewCustomer: PropTypes.bool,
    disabled: PropTypes.bool
  };

  state = {
    open: false,
    showCreateCustomerModal: false
  };

  handleClose = () => {
    this.props.onClose && this.props.onClose();
    this.setState({open: false});
  };

  handleOpen = () => {
    this.props.onOpen && this.props.onOpen();
    this.setState({open: true});
  };

  showHideCreateCustomerModal = (show) => {

    this.setState({
      showCreateCustomerModal: !!show
    })
  };

  handleCustomerCreate = customer => {
    this.props.onChange(customer.id);
  };

  render() {

    const {
      customer,
      customers,
      selectedProject,
      onChange,
      error,
      helperText,
      showCreateNewCustomer,
      disabled
    } = this.props;

    const {showCreateCustomerModal} = this.state;

    return (
      <FormControl className={'form-control w-100'} error={error}>
        <InputLabel>Customer</InputLabel>
        <Select
          open={this.state.open}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          disabled={disabled}
          value={customer}
          onChange={(event) => {
            const isOption = event.currentTarget.getAttribute('data-value') !== 'add-customer';

            if (isOption) {
              onChange(event.target.value);
            }
            else {
              this.handleClose()
            }
          }}
          input={<Input className={'w-100'}/>}
          renderValue={selected => {
            const customer = customers.find(c => c.id === selected);

            return (
              <div style={{'whiteSpace': 'initial'}}>
                {
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Avatar className={'avatar small'} style={{'backgroundColor': customer.avatarColor}}>
                      {customer.initials}
                    </Avatar>
                    <span className={'mx-3'}>{customer.name}</span>
                  </div>
                }
              </div>
            )
          }}
          MenuProps={MenuProps}
        >
          {customers.map(customer => (
            <MenuItem
              key={customer.id}
              value={customer.id}>
              <ListItemIcon className={'menu-icon'}>
                <Avatar className={'avatar medium'} style={{'backgroundColor': customer.avatarColor, color:'white'}}>
                  {customer.initials}
                </Avatar>
              </ListItemIcon>
              <ListItemText className={'menu-text'}
                            secondary={customer.contactName}
                            primary={customer.name}/>
            </MenuItem>
          ))}

          {
            showCreateNewCustomer ? <div key={'add-customer'} value={'add-customer'} className={'flex'}>
              <Button size="small" color="primary" style={{'flex': 1}} onClick={() => this.showHideCreateCustomerModal(true)}>
                <DynamicIcon name={'add'}/>
                Add new Customer
              </Button>
            </div> : null
          }

        </Select>

        { helperText ? <FormHelperText> { helperText }</FormHelperText> : null}

        <CreateCustomer open={showCreateCustomerModal}
                        project={selectedProject}
                        customer={{}}
                        confirmCallback={this.handleCustomerCreate}
                        onClose={this.showHideCreateCustomerModal}/>
      </FormControl>
    )
  }
}

export default connect(state => ({
  customers: state.project.customers,
  selectedProject: state.project.selectedProject
}), {})(CustomersSelect);

