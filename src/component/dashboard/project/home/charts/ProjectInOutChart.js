import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateUtil from '@util/date';

import {LineChart, Tooltip, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer} from 'recharts';

const initialLinesOpacity = {
  Income: 1,
  Outcome: 1,
};

class ProjectInOutChart extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    transactions: PropTypes.array,
  };

  state = {
    data: [],
    opacity: {...initialLinesOpacity},
  };

  componentDidMount() {

    this.setCalculatedData();
  }

  componentDidUpdate(prevProps) {

    const {selectedProject} = this.props;

    if (selectedProject.id !== prevProps.selectedProject.id) {
      this.setCalculatedData();
    }
  }

  setCalculatedData() {

    const {transactions} = this.props;

    const today = new Date();
    const monthStart = dateUtil.startOf(today, 'month');

    let maxDate = today;
    transactions.forEach(t => {
      if (dateUtil.isAfter(t.date, maxDate)) {
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
          Income: transactionsData[date].filter(t => t.income).reduce((total, t) => {
            total += t.amount;
            return total
          }, 0),
          Outcome: transactionsData[date].filter(t => !t.income).reduce((total, t) => {
            total += t.amount;
            return total
          }, 0)
        }
      })
    })
  }

  handleMouseEnterLeave = (item, show) => {

    if (!show) {
      this.setState({opacity: {...initialLinesOpacity}})
    }
    else {
      const {dataKey} = item;

      this.setState({
        opacity: {...{Income: 0.3, Outcome: 0.3}, [dataKey]: 1},
      });
    }

  };

  render() {

    const {data, opacity} = this.state;

    return (
      <div className={'chart-holder'}>
        <div className={'title'}> Income vs Outcome</div>
        <ResponsiveContainer height={200}>
          <LineChart data={data}
                     padding={{top: 0, right: 10, left: 10, bottom: 0}}
                     margin={{top: 0, right: 0, left: 0, bottom: 0}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Legend verticalAlign="top"
                    height={36}
                    onMouseEnter={(item) => this.handleMouseEnterLeave(item, true)}
                    onMouseLeave={() => this.handleMouseEnterLeave(undefined, false)}/>
            <Tooltip/>
            <Line type="monotone" dataKey="Income" strokeOpacity={opacity.Income} stroke="#82ca9d" activeDot={{r: 8}}/>
            <Line type="monotone" dataKey="Outcome" strokeOpacity={opacity.Outcome} stroke="#8884d8" activeDot={{r: 4}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ProjectInOutChart;