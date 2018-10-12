import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import UserAvatar from '@common/UserAvatar';
import {DIRECTIONS} from '@const/';
import {EventType} from "@model/event";
import {ProjectType} from "@model/project";
import DynamicIcon from "@common/DynamicIcon";

import dateUtil from '@util/date';
import util from '@util/';
import Button from "@material-ui/core/es/Button/Button";

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

const ProjectEventsTab = (events, overdue) => (
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

          <Button size="small" className={'button--xs ml-2'} color="primary" >
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
  };

  state = {
    activeTabIndex: 0,
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

  handleChange = (event, value) => {
    this.setState({activeTabIndex: value});
  };

  handleChangeIndex = index => {
    this.setState({activeTabIndex: index});
  };

  renderTabEvents = tab => {
    const {events} = this.props;

    const isEmpty = events.length === 0;

    const data = tab.getData(events)
      .sort(util.sortJsonFN([{name: 'date'}]));

    return (
      <div className={'events-container p-3'}>
        {!isEmpty ? ProjectEventsTab(data, tab.overdue)
          :
          <div className={'p-4'}> There are no {tab.label.toLowerCase()} events for display</div>}
      </div>
    );
  };

  render() {

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
            onChange={this.handleChange}
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
          onChangeIndex={this.handleChangeIndex}
        >
          {tabs.map(tab => <div key={tab.key}> {this.renderTabEvents(tab)} </div>)}

        </SwipeableViews>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(ProjectEvents);