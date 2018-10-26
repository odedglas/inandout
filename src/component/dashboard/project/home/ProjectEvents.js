import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import UserAvatar from '@common/UserAvatar';
import DynamicIcon from "@common/DynamicIcon";
import Button from "@material-ui/core/Button";
import CreateTransaction from '@modal/CreateTransaction'
import {DIRECTIONS} from '@const/';
import {EventType} from "@model/event";
import {ProjectType} from "@model/project";
import {showConfirmation} from "@action/dashboard";
import {
  markEventComplete,
  createTransaction,
  attachEventTransaction,
} from "@action/project";
import dateUtil from '@util/date';
import util from '@util/';
import calendarService from '@service/calendar';

const tabs = [
  {
    key: 'overdue',
    label: 'Overdue',
    overdue: true,
    getData: events => {
      const now = new Date();
      return events.filter(e => !e.completed && dateUtil.isBefore(e.date, now));
    }
  },
  {
    key: 'upcoming',
    label: 'Upcoming',
    getData: events => {
      const now = new Date();
      return events.filter(e => !e.completed && dateUtil.isAfter(e.date, now));
    }
  },
];

const overdueTabIndex = 0, upcomingTabIndex = 1;

const ProjectEventsTab = (events, overdue, completeTask, reportEvent) => (
  events.map(event => {

    const isEventType = event.type === 'EVENT';
    const icon = isEventType ? 'calendar' : 'task';

    return (
      <div className={'event'} key={event.id}>
        <div className={'body'}>
          <Avatar className={'avatar smallest mr-2'} style={{'backgroundColor': event.color}}>
            <DynamicIcon className={'icon white'} name={icon}/>
          </Avatar>

          <span className={'title'}>
                    {event.title}
          </span>

          {
            event.customer ? <Tooltip title={`Event Customer: ${event.customer.name}`}>
              <UserAvatar user={event.customer}
                          size={'smallest'}
                          className={'white mx-1'}/>
            </Tooltip> : null
          }
          <div className={`date ml-3 ${overdue ? 'overdue' : ''}`}>
            {dateUtil.format(event.date, "Do MMM")}
          </div>

          <Button size="small" className={'button--xs ml-2'}
                  style={{'justifyContent':'flex-start'}}
                  onClick={() => isEventType ? reportEvent(event) : completeTask(event)}
                  color="primary" >
            <DynamicIcon name={icon}/>
            {isEventType ? 'Report' : 'Complete'}
          </Button>

        </div>
      </div>
    );
  })
);

class ProjectEvents extends React.Component {

  static propTypes = {
    events: PropTypes.arrayOf(EventType),
    selectedProject: ProjectType,
    createTransaction: PropTypes.func.isRequired,
    attachEventTransaction: PropTypes.func.isRequired,
    markEventComplete: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
  };

  state = {
    activeTabIndex: 0,
    reportedEvent: undefined,
    showCreateTransactionModal: false,
  };

  componentDidMount() {
    const {events} = this.props;
    this.setInitialActiveTab(events,);
  }

  componentWillReceiveProps(nextProps) {

    const lastProjectId = this.props.selectedProject && this.props.selectedProject.id;
    const nextProjectId = nextProps.selectedProject && nextProps.selectedProject.id;

    if (lastProjectId !== nextProjectId) {

      this.setInitialActiveTab(nextProps.events);
    }
  }

  setInitialActiveTab(events) {

    const overdues = tabs[overdueTabIndex].getData(events);
    const upcoming = tabs[upcomingTabIndex].getData(events);

    this.setState({
      activeTabIndex: (overdues.length === 0 && upcoming.length > 0) ? upcomingTabIndex : overdueTabIndex
    });
  }

  handleTabChange = (event, value) => {
    this.setState({activeTabIndex: value});
  };

  handleTabChangeIndex = index => {
    this.setState({activeTabIndex: index});
  };

  renderTabEvents = (tab, tabIndex) => {
    const {events} = this.props;
    const {activeTabIndex} = this.state;

    const data = tab.getData(events)
      .sort(util.sortJsonFN([{name: 'date'}]));

    const isEmpty = data.length === 0;
    return tabIndex === activeTabIndex ? (
      <div className={'events-container p-3'}>
        {!isEmpty ? ProjectEventsTab(data, tab.overdue, this.onTaskComplete, this.onEventReport)
          :
          <div className={'p-4'}> There are no {tab.label.toLowerCase()} events for display</div>}
      </div>
    ) : null;
  };

  onTaskComplete = event => {

    const {showConfirmation, selectedProject, markEventComplete} = this.props;

    showConfirmation({
      title:'Complete Task',
      body: 'Please confirm this task has been done',
      icon: 'task',
      onConfirm: () => {

        markEventComplete(
          selectedProject,
          event.id,
          true
        )
      }
    });
  };

  onEventReport = event => {

    const {showConfirmation, selectedProject, markEventComplete} = this.props;

    showConfirmation({
      title:'Event Report',
      body: 'Report this event and attach if needed a transaction to it',
      icon: 'calendar',
      buttons:[
        {
          color:'secondary',
          text:'Cancel',
          onClick: (payload, close) => close()
        },
        {
          color: 'primary',
          text: 'Complete Event',
          onClick: (payload, close) => {
            markEventComplete(
              selectedProject,
              event.id,
              true
            );
            close();
          }
        },
        {
          color: 'primary',
          text: 'Report Transaction',
          onClick: (payload, close) => {

            //Show transaction modal
            this.setState({
              showCreateTransactionModal: true,
              reportedEvent: event
            });
            close();
          }
        }
      ]
    });
  };

  handleTransactionCrud = (transaction, action, cb) => {

    const {reportedEvent} = this.state;
    const {createTransaction, selectedProject} = this.props;

    if (action === 'add') {

      createTransaction(
        selectedProject,
        {
          ...transaction,
          sourceEventId: reportedEvent.id
        },
        (transaction) => {

          this.props.attachEventTransaction(
            selectedProject,
            reportedEvent.id,
            transaction,
            () => {
              cb();
              this.setState({
                reportedEvent: undefined
              })
            }
          );
        }
      )
    }
  };

  handleTransactionModalHide = () => this.setState({showCreateTransactionModal: false});

  render() {

    const {showCreateTransactionModal, reportedEvent} = this.state;
    const eventReportTransaction = reportedEvent ? calendarService.transformEventToTransaction(
      reportedEvent
    ) : {};

    const direction = DIRECTIONS.LTR;

    return (
      <div className={'project-events'}>
        <div className={'sub-header'}>
          <span style={{display: 'flex'}}> <DynamicIcon name={'calendar'}/> </span>
          <span className={'mx-3 title'}> Events </span>
        </div>
        <div>
          <Tabs
            value={this.state.activeTabIndex}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            className={'tabs'}
            textColor="primary"
            fullWidth
          >
            {tabs.map(tab => <Tab key={tab.key}
                                  className={'tab'}
                                  label={tab.label}/>)}

          </Tabs>
        </div>
        <SwipeableViews
          axis={direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.activeTabIndex}
          onChangeIndex={this.handleTabChangeIndex}
        >
          {tabs.map((tab, tabIndex) => <div key={tab.key}> {this.renderTabEvents(tab, tabIndex)} </div>)}

        </SwipeableViews>

        <CreateTransaction open={showCreateTransactionModal}
                           createInitialState={eventReportTransaction}
                           transaction={{}}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={this.handleTransactionModalHide}/>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {
  showConfirmation,
  markEventComplete,
  createTransaction,
  attachEventTransaction
})(ProjectEvents);