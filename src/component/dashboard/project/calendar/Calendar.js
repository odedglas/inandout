import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dateUtils from '@util/date';
import {CSSTransition} from 'react-transition-group';
import EventsPopper from './EventsPopper';
import {editEvent} from "@action/project";
import calendarService from '@service/calendar';
import DynamicIcon from "@common/DynamicIcon";
import {EventType} from "@model/event";
import {ProjectType} from "@model/project";

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const Event = ({event}) => {
  return (
    <div className={'event-inner'}>
      <DynamicIcon className={'icon'}
                   name={event.type === 'EVENT' ? 'calendar' : 'task'}/>
      <span className={`title ${event.completed ? 'completed' : ''}`}>{event.title}</span>

    </div>
  );
};

class Calendar extends Component {

  static propTypes = {
    events: PropTypes.arrayOf(EventType),
    project: ProjectType,
    editEvent: PropTypes.func.isRequired,
  };

  state = {
    anchorEl: null,
    open: false,
    eventForEdit: {},
  };

  componentDidMount () {

    const {location, events} = this.props;
    const selectedEventId = location.state && location.state.selectedEventId;

    if(selectedEventId) {

      const event = events.find(e => e.id === selectedEventId);
      event && setTimeout(() => this.handleEventClick(event), 100);
    }
  }

  moveEvent = ({event, start}) => {

    this.props.editEvent(
      this.props.project,
      {...event, customer: event.customer.id, date: start.getTime()},
      () => {}
    );

  };

  handleSlotClick = (event) => {

    //Create Event from slot
    const newEvent = {
      date: event.start.setHours(12),
    };

    //Finding slot dom
    const slotDom = document.querySelector(`.slot_${dateUtils.format(newEvent.date, 'DDMMYY')}`);

    slotDom.classList.add('popper-focus');
    this.handleClick(slotDom, newEvent)
  };

  handleEventClick = event => {

    const eventDom = document.querySelector(`.event_${event.id}`);
    this.handleClick(eventDom, event)
  };

  handleClick = (target, event) => {

    this.setState({
      anchorEl: target,
      open: true,
      eventForEdit: event ? {
        ...event,
        customer: event.customer ? event.customer.id : ''
      } : {},
    });
  };

  handleClose = () => {
    this.state.anchorEl.classList.remove('popper-focus');
    this.setState({
      anchorEl: null,
      open: false,
    });
  };

  eventStyleGetter = (event) => {

    return {
      backgroundColor: event.color,
      borderRadius: '5px',
      color: 'white',
      display: 'block',
      cursor: 'pointer',
      padding: '5px'
    };
  };

  render() {

    const {events, project} = this.props;
    const {open, anchorEl, eventForEdit} = this.state;

    return (
      <div style={{position: 'relative'}}>
        <CSSTransition
          in={open}
          timeout={350}
          classNames="fade"
          unmountOnExit
        >
          <div className={'calendar-mask'}></div>
        </CSSTransition>
        <DragAndDropCalendar
          className={'calendar'}
          selectable
          popup
          events={calendarService.transformToCalendarEvents(events)}
          onEventDrop={this.moveEvent}
          resizable
          views={{month: true}}
          step={60}
          eventStyleGetter={this.eventStyleGetter}
          dayPropGetter={(d) => ({
            className: `slot_${dateUtils.format(d, 'DDMMYY')}`,
          })}
          eventPropGetter={(e) => ({className: `event_${e.id}`, style: this.eventStyleGetter(e)})}
          components={{
            event: Event,
          }}
          showMultiDayTimes
          onSelectSlot={this.handleSlotClick}
          onSelectEvent={this.handleEventClick}
          defaultView={BigCalendar.Views.MONTH}
          defaultDate={new Date()}
        />

        <EventsPopper open={open}
                      anchorEl={anchorEl}
                      project={project}
                      handleClose={this.handleClose}
                      event={eventForEdit}/>
      </div>
    )
  }
}

export default compose(
  withRouter,
  DragDropContext(HTML5Backend),
  connect(null, {editEvent})
)(Calendar);