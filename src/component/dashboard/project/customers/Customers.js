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
import CreateCustomer from '@modal/CreateCustomer'
import {createCustomer} from "@action/project";
import {CustomerType} from "@model/customer";

class Customers extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    customers: PropTypes.arrayOf(CustomerType),
    createCustomer: PropTypes.func.isRequired
  };

  state = {
    showCreateCustomerModal: false,
    editCustomer: {},
  };

  showHideCreateCustomerModal = (show, customer) => {

    this.setState({
      showCreateCustomerModal: !!show,
      editCustomer: customer || {}
    })
  };

  render() {

    const {selectedProject, customers} = this.props;
    const {showCreateCustomerModal, editCustomer} = this.state;

    return (
      <div className={'customers-container'}>
        <Breadcrumb item={{id: 'customersBreadcrumb', value: 'Customers'}}/>

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

        <CreateCustomer open={showCreateCustomerModal}
                        customer={editCustomer}
                        project={selectedProject}
                        onClose={this.showHideCreateCustomerModal}/>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
  customers: state.project.customers,
}), {createCustomer})(Customers);