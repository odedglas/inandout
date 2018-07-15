import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import BudgetLineChart from '../dashboard/project/budgets/BudgetLineChart';
import BudgetCategoriesPieChart from '../dashboard/project/budgets/BudgetCategoriesPieChart';
import DynamicIcon from '@common/DynamicIcon';

import util from '@util/';

class BudgetStatistics extends Component {

  static propTypes = {
    budget: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {

    const {open, onClose, budget} = this.props;

    const shouldRenderCharts = !util.isEmptyObject(budget);

    return (
      <Dialog
        open={open}
        disableRestoreFocus={true}
        onClose={onClose}
        className={'modal budget-statistics'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={'modal-title'}>
          <DynamicIcon name={'chart'} className={'icon mr-3'}/>
          Budget statistics
        </DialogTitle>
        <DialogContent className={'modal-content'}>
          <div className={'row flex mb-3'}>
            <div className={'col-sm-12 mb-3 px-0'}>
              Budget usage over time
            </div>
            <div className={'col-sm-12 budget-chart'}>
              {shouldRenderCharts ? <BudgetLineChart  budget={budget}/> : null}
            </div>
            <div className={'col-sm-12 my-3 px-0'}>
              Expenses by category
            </div>
            <div className={'col-sm-12 budget-chart'}>
              {shouldRenderCharts ? <BudgetCategoriesPieChart budget={budget} /> : null}
            </div>
          </div>
        </DialogContent>
        <DialogActions className={'modal-actions'}>
          <Button onClick={onClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default BudgetStatistics;