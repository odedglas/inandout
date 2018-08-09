import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateUtil from '@util/date';

import {LineChart, Tooltip, Label, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer} from 'recharts';

class ProjectInOutChart extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    transactions: PropTypes.array,
  };

  state = {
    data: []
  };

  componentDidMount() {

    this.setCalculatedData();
  }

  componentDidUpdate(prevProps) {

    const { selectedProject } = this.props;

    if (selectedProject.id !== prevProps.selectedProject.id) {
      this.setCalculatedData();
    }
  }

  setCalculatedData () {

    const {transactions} = this.props;

    const today = new Date();
    const monthStart = dateUtil.startOf(today, 'month');

    let maxDate = today;
    transactions.forEach(t => {
      if(dateUtil.isAfter(t.date, maxDate)) {
        maxDate = t.date;
      }
    });

    const datesMap = dateUtil.getDatesBetween(monthStart, maxDate);
    const transactionsData = datesMap.reduce((map, date) => {

      map[date] = transactions.filter(t => dateUtil.format(t.date) === date);
      return map;
    }, {});

    this.setState({
      data: datesMap.map(date => {
        return {
          name: date,
          Income: transactionsData[date].filter(t => t.income).reduce((total,t) => {
            total+= t.amount; return total
          },0),
          Outcome: transactionsData[date].filter(t => !t.income).reduce((total,t) => {
            total+= t.amount; return total
          },0)
        }
      })
    })
  }

  render() {

    const {data} = this.state;

    return (
      <div className={'chart-holder'}>
      <div className={'title'}> Income vs Outcome</div>
      <ResponsiveContainer height={200}>
        <LineChart data={data}
                   padding={{top:0, right:10, left:10, bottom:0}}
                   margin={{top: 0, right: 0, left: 0, bottom: 0}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Line type="monotone" dataKey="Income" stroke="#82ca9d" activeDot={{r: 8}}>
          </Line>
          <Line type="monotone" dataKey="Outcome" stroke="#8884d8" activeDot={{r: 4}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
    );
  }
}

export default ProjectInOutChart;