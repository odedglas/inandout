import React, {Component} from 'react';

import {BudgetType} from '@model/budget'

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data01 = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}]

const data02 = [{name: 'A1', value: 100},
  {name: 'A2', value: 300},
  {name: 'B1', value: 100},
  {name: 'B2', value: 80},
  {name: 'B3', value: 40},
  {name: 'B4', value: 30},
  {name: 'B5', value: 50},
  {name: 'C1', value: 100},
  {name: 'C2', value: 200},
  {name: 'D1', value: 150},
  {name: 'D2', value: 50}]
class ProjectInOutChart extends Component {

  render() {

    return (
<ResponsiveContainer height={250}>
  <PieChart >
    <Pie dataKey="value" data={data01} outerRadius={60} fill="#8884d8"/>
    <Pie dataKey="value" data={data02} innerRadius={70} outerRadius={90} fill="#82ca9d" label/>
  </PieChart>
</ResponsiveContainer>
    );
  }
}

export default ProjectInOutChart;