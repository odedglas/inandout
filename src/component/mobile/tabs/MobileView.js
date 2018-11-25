import React from 'react';
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SnackbarNotification from '@common/SnackbarNotification';
import HomeCreateDial from '../../dashboard/project/home/HomeCreateDial';
import projectService from '@service/project';
import {ProjectContext} from '../../dashboard/project/ProjectContext';
import {ProjectType} from "@model/project";
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";
import {CategoryType} from "@model/category";
import dateUtil from '@util/date';
import {DIRECTIONS} from '@const/';
import OverviewTab from './OverviewTab';
import DynamicIcon from "../../common/DynamicIcon";

class ProjectHome extends React.Component {

  static propTypes = {
    project: PropTypes.oneOfType([
      PropTypes.object,
      ProjectType
    ]),
    transactions: PropTypes.arrayOf(TransactionType),
    budgets: PropTypes.arrayOf(BudgetType),
    categories: PropTypes.arrayOf(CategoryType),
    selectedDate: PropTypes.object.isRequired,
  };

  state = {
    showSuccessSnackbar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    activeTabIndex: 0,
  };

  handleChange = (event, value) => {
    this.setState({activeTabIndex: value});
  };

  handleChangeIndex = index => {
    this.setState({activeTabIndex: index});
  };

  hideSnackbar() {

    this.setState({showSuccessSnackbar: false})
  }

  showSnackbar(text, variant = 'success') {

    this.setState({
      showSuccessSnackbar: true,
      snackbarMessage: text,
      snackbarVariant: variant
    })
  }

  render() {

    const {selectedDate} = this.props;
    const {showSuccessSnackbar, snackbarMessage, snackbarVariant} = this.state;
    const direction = DIRECTIONS.LTR;

    return (
      <ProjectContext.Consumer>
        {(projectContext) => {

          const {project, transactions, budgets, categories, events} = projectContext;

          const indicators = projectService.calculateProjectIndicators(
            project,
            transactions,
            budgets,
            selectedDate
          );

          return (
            <div className={'mobile-view-wrapper row'}>

              <div className={'col-12 px-0'}>
                <Tabs
                  value={this.state.activeTabIndex}
                  onChange={this.handleChange}
                  className={'tabs'}
                  fullWidth
                >
                  <Tab icon={<DynamicIcon name={'projects'}/>}/>
                  <Tab icon={<DynamicIcon name={'transactions'}/>}/>
                  <Tab icon={<DynamicIcon name={'budgets'}/>}/>
                  <Tab icon={<DynamicIcon name={'calendar'}/>}/>

                </Tabs>
                <div className={'tabs-content'}>
                  <SwipeableViews
                    axis={direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.activeTabIndex}
                    onChangeIndex={this.handleChangeIndex}
                  >

                    <OverviewTab project={project}
                                 selectedDate={selectedDate}
                                 currency={project.currency}
                                 overall={indicators.totalBalance}
                                 balance={indicators.monthlyBalance}/>
                    <div> Transactions</div>
                    <div> Budgets</div>
                    <div> Calendar</div>
                  </SwipeableViews>
                </div>
              </div>

              <HomeCreateDial showNotification={(message, variant) => this.showSnackbar(message, variant)}/>
              <SnackbarNotification onClose={() => this.hideSnackbar()}
                                    anchor={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                    }}
                                    open={showSuccessSnackbar}
                                    duration={2500}
                                    variant={snackbarVariant}
                                    message={snackbarMessage}>
              </SnackbarNotification>
            </div>
          );
        }}
      </ProjectContext.Consumer>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedDate: state.project.selectedDate,
  }), {})
)(ProjectHome);
