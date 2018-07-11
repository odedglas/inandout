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
import {BudgetType} from '@model/budget'
import transactionService from '@service/transaction';
import budgetService from '@service/budget';

const projectKey = '-LGOC58sci12TBNBgFIO';
const budgets = [
  {
    name: 'Home expenses',
    categories: [
      'LGJxyxahJotZKdD0InN',
      'LGJxyxahJotZKdD0InM'
    ],
    limit: 1200,
    actual: 1000,
    warningLimit: 440,
  },
  {
    name: 'Car',
    categories: [
      'LGJxyxZP55gDmIqGsiI'
    ],
    limit: 450,
    actual: 225,
  }
];
/*
budgets.forEach(b => {
  budgetService.createBudget(projectKey, b)
})
*/
let now = new Date();
now = now.getTime();
const transactions = [
  {
    income: true,
    date: now,
    amount: 1399,
    description: 'Salary',
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
  },
  {
    income: false,
    date: now,
    amount: 44,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxZP55gDmIqGsiI'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 66,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxZP55gDmIqGsiI'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 77,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxZP55gDmIqGsiI'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 44,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxZP55gDmIqGsiI'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 55,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxahJotZKdD0InM'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 76,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxahJotZKdD0InM'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 23,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxahJotZKdD0InN'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },
  {
    income: false,
    date: now,
    amount: 15,
    owner: 'j2CmfNpmPcZyAXLL05YZHIhI9Lz1',
    category: '-LGJxyxahJotZKdD0InN'  // -LGJxyxahJotZKdD0InL , -LGJxyxahJotZKdD0InM, -LGJxyxahJotZKdD0InN
  },

];
/*transactions.forEach(t => {
  transactionService.createTransaction(
    projectKey,
    t
  );
})*/
class Budgets extends Component {

  static propTypes = {
    budgets: PropTypes.arrayOf(BudgetType)
  };

  state = {
    expanded: null,
  };

  handleExpandPanelChange = (budgetId) => {

    this.setState({expanded: budgetId})
  };

  showHideCreateBudge = (show) => {


  };

  render() {

    const {budgets} = this.props;
    const {expanded} = this.state;

    return (
      <div className={'budgets-container'}>

        <PageTitle text={'Budgets'} icon={'budgets'}/>

        <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets', path: '/dashboard'}}/>

        <div className={'px-4 py-3'}>
        {
          budgets.map(budget => <BudgetPanel key={budget.id}
                                             onExpandChange={this.handleExpandPanelChange}
                                             expanded={expanded === budget.id}
                                             budget={budget}/>)
        }
        </div>

        <Tooltip title={'Create Budget'} placement={'top'} >
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
  budgets: state.project.budgets,
}), {})(Budgets);