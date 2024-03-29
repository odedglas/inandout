import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateUtil from '@util/date';
import util from '@util';

import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols
} from 'recharts';
import {ProjectType} from "@model/project";

const INCOME_KEY = "Incomes";
const OUTCOME_KEY = "Outcomes";

const ChartTooltip = ({value, name, props}) => {

  const {payload} = props;
  const {dailyIncomes, dailyOutcomes} = payload;

  let isIncome = name === INCOME_KEY;
  const showDaily = isIncome ? dailyIncomes > 0 : dailyOutcomes > 0;
  const dailyAmount = isIncome ? dailyIncomes : dailyOutcomes;

  return (
    <span>
      {util.formatNumber(value)}
      <small className={`inandout-chart-tooltip ${isIncome ? 'income' : 'outcome'}`}>
        {showDaily && <span> |&nbsp; Daily: </span>}
        {showDaily && <span key={'dailyIncomes'}>+{util.formatNumber(dailyAmount)}</span>}
      </small>
    </span>
  );
};
const dataGuard = {
    last() {

      const keys = Object.keys(this).filter(key =>!(typeof this[key] === 'function'));
      return {
        key: keys.length !== 0 ? +keys[0] : 0,
        data: this[keys[0]]
      }
    },
    remove() {
      const keys = Object.keys(this).filter(key =>!(typeof this[key] === 'function'));
      keys.forEach(key => delete this[key]);
    }
};

class ProjectInOutChart extends Component {

  static propTypes = {
    selectedProject: ProjectType,
    selectedDate: PropTypes.object,
    transactions: PropTypes.array,
  };

  state = {
    data: [],
    disabledSets: [],
  };

  getData() {

    const {transactions, selectedDate} = this.props;

    const timeNow = (new Date()).getTime();
    const lastItem = dataGuard.last();
    if(timeNow < (lastItem.key + 700 )) {

        return lastItem.data;
    }

    const monthStart = dateUtil.startOf(selectedDate);
    const thisMonth = dateUtil.sameMonth(selectedDate, dateUtil.now());

    let maxDate = thisMonth ? selectedDate : dateUtil.endOf(selectedDate);
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

    let cumulativeIncomes = 0,
      cumulativeOutcomes = 0;

    dataGuard.remove();
    dataGuard[timeNow] = datesMap.map(date => {
      return {
        name: date,
        dailyIncomes: transactionsData[date].filter(t => t.income).reduce((total, t) => {
          total += t.amount;
          cumulativeIncomes += t.amount;
          return total
        }, 0),
        dailyOutcomes: transactionsData[date].filter(t => !t.income).reduce((total, t) => {
          total += t.amount;
          cumulativeOutcomes += t.amount;
          return total
        }, 0),
        [INCOME_KEY]: cumulativeIncomes,
        [OUTCOME_KEY]: cumulativeOutcomes
      }
    });

    return dataGuard[timeNow];
  }

  handleLegendClick = (key) => {

    let dataKey = key.trim();
    const currentDisabled = this.state.disabledSets;
    const isDisabled = currentDisabled.includes(dataKey);

    if (isDisabled) {
      //Removing
      this.setState({
        disabledSets: currentDisabled.filter(d => d !== dataKey)
      })
    }
    else {
      //Adding
      this.setState({
        disabledSets: [
          ...currentDisabled,
          dataKey
        ]
      })
    }

  };

  renderCustomLegend = ({payload}) => {
    return (
      <div className="inout-chart-legend">
        {payload.map(entry => {
          const {dataKey, color} = entry;
          const _dataKey = dataKey.trim();

          const disabled = this.state.disabledSets.includes(_dataKey);
          const style = {
            color: disabled ? "#AAA" : "#000"
          };

          return (
            <span
              className="legend-item"
              key={_dataKey}
              onClick={() => this.handleLegendClick(_dataKey)}
              style={style}
            >
              <Surface width={10} height={10} viewBox={{x: 0, y: 0, height: 10, width: 10}}>
                <Symbols cx={5} cy={5} type="circle" size={80} fill={color}/>
                {disabled && (
                  <Symbols
                    cx={5}
                    cy={5}
                    type="circle"
                    size={25}
                    fill={"#FFF"}
                  />
                )}
              </Surface>
              <span className={`mx-2 label ${disabled ? 'disabled' : '' }`}>{_dataKey}</span>
            </span>
          );
        })}
      </div>
    );
  };

  render() {

    const {disabledSets} = this.state;

    const data = this.getData();
    const showIncomes = !disabledSets.includes(INCOME_KEY);
    const showOutcomes = !disabledSets.includes(OUTCOME_KEY);

    return (
      <div className={'chart-holder'}>
        <div className={'title'} style={{position: 'absolute'}}> Income vs Outcome</div>
        <ResponsiveContainer height={240}>
          <AreaChart data={data}
                     padding={{top: 0, right: 10, left: 10, bottom: 0}}
                     margin={{top: 0, right: 0, left: 0, bottom: 0}}>
            <defs>
              <linearGradient id="IncomeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="OutcomeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Legend verticalAlign="top"
                    height={36}
                    content={this.renderCustomLegend}
                    onClick={this.handleLegendClick}/>
            <Tooltip formatter={(value, name, props) => <ChartTooltip value={value} name={name} props={props}/>}/>
            <Area type="monotone"
                  dataKey={showIncomes ? INCOME_KEY : INCOME_KEY + ' '}
                  stroke="#82ca9d" fill="url(#IncomeColor)" activeDot={{r: 8}}/>
            <Area type="monotone"
                  dataKey={showOutcomes ? OUTCOME_KEY : OUTCOME_KEY + ' '}
                  stroke="#8884d8" fill="url(#OutcomeColor)" activeDot={{r: 4}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ProjectInOutChart;