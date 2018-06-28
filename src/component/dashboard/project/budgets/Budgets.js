import React, {Component} from 'react';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

class Budgets extends Component {

  render() {

    return (
      <div className={'welcome-container'}>
        <Breadcrumb item={{id:'budgetsCrumb' ,value:'Budgets', path:'/dashboard'}}/>

        I R Budgets
      </div>
    );
  }
}

export default Budgets;