import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2';
import {BudgetType} from '@model/budget'

class BudgetLineChart extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    chartData: {}
  };

  componentWillReceiveProps(nextProps) {

    const {budget} =  nextProps;
    const transactions = budget.transactions;

    const labels = budget.categories.map(c => c.name);
    const datasets = [{
      backgroundColor: budget.categories.map( c => c.color ),
      data: budget.categories.map(c => {

        const categoryTransactions = transactions.filter(t => t.category.id === c.id);
        return categoryTransactions.reduce((total, t) => {total += t.amount; return total}, 0);
      })
    }];

    this.setState({chartData: {
      labels,
      datasets
    }})
  }

  render() {
    const {chartData} =  this.state;

    return (
      <Pie data={chartData}
            height={150}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}/>
    );
  }
}

export default BudgetLineChart;