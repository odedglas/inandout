import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import DynamicIcon from "@common/DynamicIcon";
import BudgetPanel from './BudgetPanel';
import PageTitle from "@common/PageTitle";

import Breadcrumb from '../breadcrumbs/Breadcrumb';

const budgets = [
  {
    name: 'Home expenses',
    id: 'test',
    categories: [
      {
        name: 'Car and Transportation',
        id: '1237',
        color: '#EF9A9A',
        icon: 'transportation'
      },
      {
        name: 'Clothing',
        id: '12349',
        color: '#F48FB1',
        icon: 'cloth'
      },
      {
        name: 'Eating out',
        id: '12348',
        color: '#CE93D8',
        icon: 'eating'
      }
    ],
    limit: 1200,
    actual: 1000,
    warningLimit: 440,
  },
  {
    name: 'Car',
    id: 'tes2t',
    categories: [
      {
        name: 'Fitness',
        id: '12346',
        color: '#9FA8DA',
        icon: 'fitness'
      }
    ],
    limit: 4000,
    actual: 885,
  }
];

class Budgets extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  showHideCreateBudge = (show) => {

  };

  render() {
    const {selectedProject} = this.props;

    return (
      <div className={'budgets-container'}>

        <PageTitle text={'Budgets'} icon={'budgets'}/>

        <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets', path: '/dashboard'}}/>

        <div className={'px-4 py-3'}>
        {
          budgets.map(budget => <BudgetPanel key={budget.id} budget={budget}/>)
        }
        </div>

        <Tooltip title={'Create Budget'} placement={'top'}>
          <Zoom in={true} timeout={400}>
            <Button variant="fab"
                    color="secondary"
                    onClick={() => this.showHideCreateBudge(true)}
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
  selectedProject: state.project.selectedProject,
  categories: state.category.categories,
}), {})(Budgets);