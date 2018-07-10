import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2';
import {BudgetType} from '@model/budget'
import budgetService from '@service/budget';

class BudgetLineChart extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    chartData: {},
    chartOptions: {}
  };

  componentWillReceiveProps(nextProps) {

    const {budget} =  nextProps;
    const transactions = budget.transactions;

    const labels = budget.categories.map(c => c.name);
    const datasets = [{
      backgroundColor: budget.categories.map( c => c.color ),
      data: budget.categories.map(c => {

        const categoryTransactions = transactions.filter(t => t.category.id === c.id);
        return categoryTransactions.reduce((total, t) => {
          total += t.amount; return total
        }, 0);
      })
    }];

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        bodySpacing: 8,
        titleMarginBottom: 10,
        callbacks: {
          afterLabel: function (tooltipItem, data) {
            let categoryValue = data.datasets[0].data[tooltipItem.index];
            return `${budgetService.getUsage(categoryValue, budget.actual)}% of Budget\'s actual`
          }
        }
      },
    };

    this.setState({chartData: {labels,datasets}, chartOptions: options})
  }

  render() {
    const {chartData, chartOptions} =  this.state;

    return (
      <Pie data={chartData}
            options={chartOptions}/>
    );
  }
}

export default BudgetLineChart;