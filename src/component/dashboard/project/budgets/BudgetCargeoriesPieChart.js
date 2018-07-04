import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2';


const data = {
  labels: ["Green", "Blue", "Gray"],
  datasets: [{
    backgroundColor: [
      "#2ecc71",
      "#3498db",
      "#95a5a6",
    ],
    data: [12, 19, 3]
  }]
};

class BudgetLineChart extends Component {

  render() {

    return (
      <Pie data={data}
            height={150}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}/>
    );
  }
}

export default BudgetLineChart;