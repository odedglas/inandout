import React, {Component} from 'react';
import 'chartjs-plugin-annotation'
import PropTypes from 'prop-types'
import {Line} from 'react-chartjs-2';


const data = {
  labels: ['1/7', '5/7', '10/7', '15/7', '20/7', '25/7', '31/7'],
  datasets: [{
    type:'line',
    data: [10, 17, 23, 26, 55, 67],
    fill: false,
    borderColor: '#EC932F',
    backgroundColor: '#EC932F',
    pointBorderColor: '#EC932F',
    pointBackgroundColor: '#EC932F',
    pointHoverBackgroundColor: '#EC932F',
    pointHoverBorderColor: '#EC932F',
  }]
};

class BudgetLineChart extends Component {

  render() {

    return (
      <Line data={data}
            height={150}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  },
                  gridLines: {
                    display: false
                  }
                }],
                xAxes: [{
                  gridLines: {
                    display: false
                  }
                }],
              },

                annotation: {
                  annotations: [{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: '60',
                    borderColor: 'tomato',
                    borderWidth: 1
                  }],
                  drawTime: "afterDraw" // (default)
                }
            }}/>
    );
  }
}

export default BudgetLineChart;