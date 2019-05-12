import React from 'react';
import PropTypes from 'prop-types'
import {Calendar} from 'material-ui-pickers';
import Avatar from '@material-ui/core/Avatar';
import UserAvatar from '@common/UserAvatar';
import DynamicIcon from '@common/DynamicIcon';
import Paper from '@material-ui/core/Paper';
import CreateEvent from '@modal/CreateEvent'

import dateUtil from '@util/date'

const EventStatus = ({ event, isEventType }) => {

  let indicatorClass, statusText;

  if(isEventType) {
    const overdue = !event.completed && dateUtil.isBefore(event.date, dateUtil.now());
    statusText = event.completed ? 'DONE' : (overdue ? 'OVERDUE' : 'UPCOMING');
    indicatorClass = event.completed ? 'natural' : (overdue ? 'denied' : 'success');
  }
  else{
    statusText = event.completed ? 'DONE' : 'OPEN';
    indicatorClass = event.completed ? 'natural' : 'success'
  }

  return (
    <div className={`status-indicator mb-1 ${indicatorClass}`}>
      {statusText}
    </div>
  )
};

class CalendarTab extends React.Component {

  static propTypes = {
    projectSelectedDate: PropTypes.object,
    events: PropTypes.array
  };

  state = {
    selectedDate: dateUtil.wrap(new Date()),
    showEventCreateModal: false,
    eventForEdit: {}
  };

  onSelectDate = (date) => {

    this.setState({
      selectedDate: date
    });
  };


  showHideCreateEvent = (show, event) => {

    this.setState({
      showEventCreateModal: !!show,
      eventForEdit: event || {}
    });

  };

  render() {

    const {selectedDate, showEventCreateModal, eventForEdit} = this.state;
    const {events} = this.props;

    const eventsMap = events.reduce((map, e) => {
      const key = dateUtil.format(e.date);
      map[key] = map[key] ? [
        ...map[key],
        e
      ] : [e];
      return map;
    }, {});

    const selectedEvents = eventsMap[dateUtil.format(selectedDate)] || [];
    const hasSelected = selectedEvents.length > 0;

    return (
      <div className={'tab calendar-tab row'}>

        <Paper style={{overflow: 'hidden', width: '100%'}}>
          <Calendar date={selectedDate}
                    classes={{
                      transitionContainer: 'calendar-wrapper'
                    }}
                    allowKeyboardControl={true} m
                    renderDay={(day, selectedDate, dayInCurrentMonth, dayComponent) => {

                      const dayKey = dateUtil.format(day);
                      const today = dayKey === dateUtil.format(selectedDate);
                      const dailyEvents = eventsMap[dayKey] || [];

                      return <div key={day.toString()} className={'day-wrapper'}>
                        <div className={'events'}> {!today && dayInCurrentMonth && dailyEvents.map(e =>
                          <span key={e.date.toString()} className={`event ${e.completed ? 'completed' : ''}`} style={{'backgroundColor': e.color}}/>)}
                        </div>
                        {dayComponent}
                      </div>;
                    }}
                    onChange={this.onSelectDate}/>

          <div className={'row events-details'}>
            {hasSelected && <div className={'title'}> {dateUtil.format(selectedDate, 'Do MMM ')} </div>}
            {
              selectedEvents.map(event => {

                const isEventType = event.type === 'EVENT';
                const icon = isEventType ? 'calendar' : 'task';

                return (
                  <div className={'col-12 event-row flex'} key={event.date.toString()}
                       onClick={() => this.showHideCreateEvent(true, event)}
                       style={{'borderLeftColor': event.color}}>

                    {
                      event.customer ? <UserAvatar user={event.customer}
                                                   size={'medium'}
                                                   className={'white mx-1'}/> : <Avatar className={'avatar medium mr-2'}>
                        <DynamicIcon className={'icon white'} name={icon}/>
                      </Avatar>
                    }

                    <div className={'flex-between flex-row'}>
                      <div className={'event-title mx-2'} style={{flex: 2}}>
                        <div> {event.title} </div>
                        <div className={'customer-details'}> {event.customer && event.customer.name} </div>
                      </div>

                      <div className={'ml-1 sub-details'}>
                        <EventStatus event={event} isEventType={isEventType}/>
                        <div className={`date`}>
                          {dateUtil.format(event.date, "HH:mm A")}
                        </div>
                      </div>
                    </div>

                  </div>
                )
              })
            }
          </div>
        </Paper>

        <CreateEvent open={showEventCreateModal}
                     event={eventForEdit}
                     onClose={this.showHideCreateEvent}/>
      </div>
    );
  }

}

export default CalendarTab;