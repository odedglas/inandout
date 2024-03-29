import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import {PieChart, Pie, ResponsiveContainer, Cell} from 'recharts';

import util from '@util/'
import navgationUtil from '@util/navigation';
import {TransactionType} from "@model/transaction";
import {CategoryType} from "@model/category";
import {ProjectType} from "@model/project";

class ProjectExpenseByChart extends Component {

  static propTypes = {
    selectedProject: ProjectType,
    selectedDate: PropTypes.object,
    transactions: PropTypes.arrayOf(TransactionType),
    categories: PropTypes.arrayOf(CategoryType),
  };

  state = {
    data: [],
    activeItem: undefined
  };

  componentDidMount() {
    const {transactions, categories} =  this.props;
    this.setMaxActiveItem(transactions, categories);
  }

  componentWillReceiveProps(nextProps) {

    const lastProjectId = this.props.selectedProject && this.props.selectedProject.id;
    const nextProjectId = nextProps.selectedProject && nextProps.selectedProject.id;

    const lastSelected = this.props.selectedDate;
    const currentSelected = nextProps.selectedDate;

    if (lastProjectId !== nextProjectId || lastSelected !== currentSelected) {

      this.setMaxActiveItem(nextProps.transactions, nextProps.categories);
    }
  }

  setMaxActiveItem(transactions, categories) {

    const nextCategories = this.getData(transactions, categories);
    const valuedCategories = nextCategories.filter(c => c.value);
    const maxValuedCategory = valuedCategories.sort(util.sortJsonFN([{name: 'value', reverse: true}]))[0];

    this.setState({
      activeItem: maxValuedCategory ? maxValuedCategory : undefined
    });
  }

  getData(transactions, categories) {

    return categories.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      value: transactions.filter(t => !t.income && t.category.id === c.id).reduce((total, t) => {
        total += t.amount;
        return total;
      }, 0)
    }))
  }

  onItemEnterLeave = (item) => {

    this.setState({activeItem: item});
  };

  viewCategoryTransactions = (categoryId) => {

    const {history, selectedProject} = this.props;

    history.push({
      pathname: navgationUtil.projectLink(selectedProject, 'transactions'),
      state: {
        initialFilter: [
          {
            filterId: "category",
            operator: "in",
            value: [categoryId]
          }
        ]
      }
    })
  };

  render() {

    const {transactions, categories} = this.props;
    const {activeItem} = this.state;

    const data = this.getData(transactions, categories);
    const _activeItem = activeItem ? activeItem : {};

    return (
      <div className={'chart-holder'}>
        <div className={'title px-3 text-center mt-'}> Expense by category</div>

        <div className="category-display">
          <Avatar className={'avatar medium mt-2'}
                  onClick={() => this.viewCategoryTransactions(_activeItem.id)}
                  style={{'backgroundColor': _activeItem.color, cursor: 'pointer', zIndex: 2}}>
            {activeItem ? <DynamicIcon className={'icon'} name={_activeItem.icon}/> : null}
          </Avatar>
          <div className="category-details my-2">
            <div>{_activeItem.name} </div>
            <div className={'value'}> <b> {_activeItem.value} </b> </div>
          </div>
        </div>

        <ResponsiveContainer height={200}>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              onClick={(item) => this.viewCategoryTransactions(item.id)}
              innerRadius={80}
              outerRadius={100}
              onMouseEnter={item => this.onItemEnterLeave(item, true)}>
              {
                data.map((entry, index) => <Cell style={{cursor: 'pointer'}} key={entry.name} fill={entry.color}/>)
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
  }), {})
)(ProjectExpenseByChart);
