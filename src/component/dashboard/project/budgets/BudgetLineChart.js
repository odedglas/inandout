import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {BudgetType} from '@model/budget'
import themeService from '@service/theme';
import budgetService from '@service/budget';

const lineColor = '#4682b4';

class BudgetLineChart extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    chartData: {},
    chartOptions: {},
  };

  componentDidMount() {

    const {budget} = this.props;
    const transactions = budget.transactions;

    let cumulativeSet = [];
    let cumulative = 0;
    const transactionsDatesMap = transactions.reduce((total, transaction) => {
      const current = total[transaction.date] || 0;
      cumulative += transaction.amount + current;
      cumulativeSet.push(cumulative);
      total[transaction.date] = transaction.amount + current;
      return total
    }, {});

    const dates = Object.keys(transactionsDatesMap);

    const budgetIndicatorColor = budgetService.getBudgetStatusIndicator(
      budget
    ).color;

    const data = {
      labels: dates,
      datasets: [
        {
          data: dates.map(d => transactionsDatesMap[d]),
          fill: false,
          label: 'Daily Usage',
          backgroundColor: themeService.withOpacity(lineColor, 0.8),
          borderColor: themeService.withOpacity(lineColor, 0.7),
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: themeService.withOpacity(lineColor, 1),
          pointBackgroundColor: themeService.withOpacity(lineColor, 0.8),
        },
        {
          label: 'Cumulative Usage',
          backgroundColor: themeService.withOpacity(budgetIndicatorColor, 0.3),
          borderColor: themeService.withOpacity(budgetIndicatorColor, 0.5),
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: themeService.withOpacity(budgetIndicatorColor, 1),
          pointBackgroundColor: themeService.withOpacity(budgetIndicatorColor, 0.8),
          data: cumulativeSet
        },
        {
          label: 'Limit',
          data: dates.map(d => budget.limit),
          fill: false,
          borderColor: '#e53935',
          backgroundColor: '#e53935',
          borderWidth: 1,
          pointBorderColor: 'transparent',
          pointBackgroundColor: 'transparent',
          pointHoverBackgroundColor: 'transparent',
          pointHoverBorderColor: 'transparent',
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        position: 'nearest',
        bodySpacing: 8,
        titleMarginBottom: 10,
        filter: function (tooltipItem) {
          return tooltipItem.datasetIndex < 2;
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: false
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ],
      },
    };

    this.setState({chartOptions: options, chartData: data})
  }

  render() {

    const {chartData, chartOptions} = this.state;

    return (
      <Line data={chartData}
            height={150}
            options={chartOptions}/>
    );
  }
}

export default BudgetLineChart;