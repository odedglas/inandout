import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import DynamicIcon from "@common/DynamicIcon";
import PageTitle from "@common/PageTitle";
import CustomersList from './CustomersList';

import {CustomerType} from "@model/customer";

class Customers extends Component {

  static propTypes = {
    customers: PropTypes.arrayOf(CustomerType)
  };

  state = {
    showCreateCustomerModal: false,
    editCustomer: {},
  };

  showHideCreateCustomerModal = (show, customer) => {

    this.setState({
      showCreateCategoryModal: !!show,
      editCategory: customer || {}
    })
  };

  render() {

    const { customers } = this.props;

    return (
      <div className={'customers-container'}>
        <Breadcrumb item={{id: 'customersBreadcrumb', value: 'Customers', path: '/dashboard'}}/>

        <PageTitle text={'Customers'} icon={'customers'}/>

        <div className={'row px-2'}>
          <CustomersList customers={customers}
                         showHideCreateCustomerModal={this.showHideCreateCustomerModal}/>
        </div>

        <Tooltip title={'Create Customer'} placement={'top'}>
          <Zoom in={true} timeout={400}>
            <Button variant="fab"
                    color="secondary"
                    onClick={() => this.showHideCreateCustomerModal(true)}
                    aria-label="add"
                    className={'fab'}>
              <DynamicIcon name={'add'}/>
            </Button>
          </Zoom>
        </Tooltip>
      </div>
    );
  }
}

export default connect(state => ({
  customers: state.project.customers,
}), {})(Customers);