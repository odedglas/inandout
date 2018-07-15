import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import {BudgetType} from '@model/budget'
import budgetService from '@service/budget';

class BudgetCategoriesPieChart extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    chartData: {},
    chartOptions: {}
  };

  componentDidMount() {

    const {budget} = this.props;
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
            const categoryValue = data.datasets[0].data[tooltipItem.index];
            const isSingle = data.datasets[0].data.length === 1;

            return !isSingle ? `${budgetService.getUsage(categoryValue, budget.actual)}% of Budget's actual` : ''
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
           height={120}
           options={chartOptions}/>
    );
  }
}

export default BudgetCategoriesPieChart;