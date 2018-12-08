import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import DynamicIcon from "@common/DynamicIcon";
import PageTitle from "@common/PageTitle";
import CustomersList from './CustomersList';
import CreateCustomer from '@modal/CreateCustomer'
import {createCustomer} from "@action/project";
import {ProjectContext} from '../ProjectContext';

class Customers extends Component {

  static propTypes = {
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

    const {showCreateCustomerModal, editCustomer} = this.state;

    return (
      <div className={'customers-container'}>
        <Breadcrumb item={{id: 'customersBreadcrumb', value: 'Customers'}}/>

        <PageTitle text={'Customers'} icon={'customers'}/>

        <ProjectContext.Consumer>
          {(projectContext) => (
            <div>
              <div className={'row px-2'}>
                <CustomersList customers={projectContext.customers}
                               project={projectContext.project}
                               showHideCreateCustomerModal={this.showHideCreateCustomerModal}/>
              </div>

              <Tooltip title={'Create Customer'} placement={'top'}>
                <Zoom in={true} timeout={400}>
                  <Fab color="secondary"
                       onClick={() => this.showHideCreateCustomerModal(true)}
                       aria-label="add"
                       classes={{'root': 'fab'}}>
                    <DynamicIcon name={'add'}/>
                  </Fab>
                </Zoom>
              </Tooltip>

              <CreateCustomer open={showCreateCustomerModal}
                              customer={editCustomer}
                              project={projectContext.project}
                              onClose={this.showHideCreateCustomerModal}/>
            </div>
          )}
        </ProjectContext.Consumer>
      </div>
    );
  }
}

export default connect(null, {createCustomer})(Customers);