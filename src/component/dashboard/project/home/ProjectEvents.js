import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import UserAvatar from '@common/UserAvatar';
import {DIRECTIONS} from '@const/';
import {EventType} from "@model/event";
import DynamicIcon from "@common/DynamicIcon";
import Chip from '@material-ui/core/Chip';
import dateUtil from '@util/date';
import util from '@util/';

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

class ProjectEvents extends React.Component {

  static propTypes = {
    events: PropTypes.arrayOf(EventType),
  };

  state = {
    activeTabIndex: 0,
  };

  handleChange = (event, value) => {
    this.setState({activeTabIndex: value});
  };

  handleChangeIndex = index => {
    this.setState({activeTabIndex: index});
  };

  renderTabEvents = tab => {
    const {events} = this.props;

    const data = tab.getData(events)
      .sort(util.sortJsonFN([{name: 'date'}]));

    return (
      <div className={'events-container p-2'}>
        {data.map(event => {

          return (
            <div className={'event'} key={event.id}>
              <div className={'body'}>
                <Chip className={'event-chip mr-3 white'}
                      style={{backgroundColor: event.color}}
                      label={event.type === 'EVENT' ? 'Event' : 'Task'}/>

                <span className={'title'}>
                    {event.title}
                  </span>
                <div className={'flex'}></div>
                {
                  event.customer ? <Tooltip title={`Event Customer: ${event.customer.name}`}>
                    <UserAvatar user={event.customer}
                                size={'smallest'}
                                className={'white mx-1'}/>
                  </Tooltip> : null
                }
                <div className={`date mx-3 ${tab.overdue ? 'overdue' : ''}`}>
                  {dateUtil.format(event.date, "Do MMM")}
                </div>
                <div className={'action'}>
                  <Button size="small" color="primary" onClick={this.handleEditBudge}>
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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

export default ProjectEvents;