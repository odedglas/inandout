import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import {PieChart, Pie, ResponsiveContainer, Tooltip, Cell} from 'recharts';
import {CSSTransition} from 'react-transition-group';

import {TransactionType} from "@model/transaction";
import {CategoryType} from "@model/category";

class ProjectExpenseByChart extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    categories: PropTypes.arrayOf(CategoryType),
  };

  state = {
    data: [],
    showCategoryDisplay: false,
    activeItem: undefined
  };

  getData() {

    const {transactions, categories} = this.props;

    return categories.map(c => ({
      name: c.name,
      icon: c.icon,
      color: c.color,
      value: transactions.filter(t => !t.income && t.category.id === c.id).reduce((total, t) => {
        total += t.amount;
        return total;
      }, 0)
    }))
  }

  onItemEnterLeave = (item, show) => {

    this.setState({activeItem: item, showCategoryDisplay: show});
  };

  render() {

    const {activeItem, showCategoryDisplay} = this.state;

    const _activeItem = activeItem ? activeItem : {};
    const data = this.getData();

    return (
      <div className={'chart-holder'}>
        <div className={'title px-3 text-center mt-'}> Expense by category</div>
        <CSSTransition
          in={showCategoryDisplay}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className="category-display">
            <Avatar className={'avatar medium mt-2'} style={{'backgroundColor': _activeItem.color}}>
              {activeItem ? <DynamicIcon className={'icon'} name={_activeItem.icon}/> : null}
            </Avatar>
            <div className="category-details my-2">
              <div>{_activeItem.name} </div>
              <span className={'value'}> : <b> {_activeItem.value} </b> </span></div>
          </div>
        </CSSTransition>

        < ResponsiveContainer height={200}>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              innerRadius={80}
              outerRadius={100}
              onMouseEnter={item => this.onItemEnterLeave(item, true)}
              onMouseLeave={item => this.onItemEnterLeave(undefined, false)}>
              {
                data.map((entry, index) => <Cell key={entry.name} fill={entry.color}/>)
              }
            </Pie>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ProjectExpenseByChart;