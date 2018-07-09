import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Line} from 'react-chartjs-2';
import {BudgetType} from '@model/budget'

let lineColor = '#4682b4';
const data = {
  labels: [
    '1/7',
    '5/7',
    '10/7',
    '15/7',
    '20/7',
    '25/7',
    '31/7'
  ],
  datasets: [
    {
      type: 'line',
      data: [
        10,
        17,
        23,
        26,
        55,
        67
      ],
      fill: false,
      borderColor: lineColor,
      backgroundColor:lineColor,
      pointBorderColor: lineColor,
      pointBackgroundColor: lineColor,
      pointHoverBackgroundColor: lineColor,
      pointHoverBorderColor: lineColor,
    }
  ]
};

class BudgetLineChart extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    chartData: {},
    chartOptions: {},
  };

  componentWillReceiveProps(nextProps) {

    const {budget} =  nextProps;
    const transactions = budget.transactions;

    const data = {
      labels: [
        '1/7',
        '5/7',
        '10/7',
        '15/7',
        '20/7',
        '25/7',
        '31/7'
      ],
      datasets: [
        {
          type: 'line',
          data: [
            0,
            150,
            453,
            555,
            587,
            675,
          ],
          fill: false,
          label: 'Usage',
          borderColor: lineColor,
          backgroundColor:lineColor,
          pointBorderColor: lineColor,
          pointBackgroundColor: lineColor,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: lineColor,
        },
        {
          type:'line',
          label: 'Limit',
          data:[
            budget.limit,budget.limit,budget.limit,budget.limit,budget.limit,budget.limit
          ],
          fill: false,
          borderColor: '#e53935',
          backgroundColor:'#e53935',
          borderWidth: 1,
          pointBorderColor: 'transparent',
          pointBackgroundColor: 'transparent',
          pointHoverBackgroundColor: 'transparent',
          pointHoverBorderColor: 'transparent',
        }
      ]
    };

    const options ={
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        yAlign: 'bottom',
        filter: function (tooltipItem) {
          return tooltipItem.datasetIndex === 0;
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
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

    this.setState({ chartOptions: options, chartData: data})
  }

  render() {

    const {chartData, chartOptions} = this.state;

    return (
      <Line data={chartData}
            height={70}
            options={chartOptions}/>
    );
  }
}

export default BudgetLineChart;