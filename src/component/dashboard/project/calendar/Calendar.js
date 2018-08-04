import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dateUtils from '@util/date';
import {CSSTransition} from 'react-transition-group';
import EventsPopper from './EventsPopper';

import calendarService from '@service/calendar';
import DynamicIcon from "@common/DynamicIcon";

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const Event = ({event}) => {
  return (
    <div className={'event-inner'}>
      <DynamicIcon className={'icon'} name={event.type === 'EVENT' ? 'calendar' : 'task'}/>
      <span className={'title'}>{event.title}</span>

    </div>
  );
};

class Calendar extends Component {

  static propTypes = {
    events: PropTypes.array
  };

  state = {
    anchorEl: null,
    open: false,
    event: {},
  };

  moveEvent = ({event, start, end}) => {
    const {events} = this.state;

    const idx = events.indexOf(event);

    const updatedEvent = {...event, start, end};

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents,
    })

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
      eventForEdit: event || {},
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

    const {events} = this.props;
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
                      handleClose={this.handleClose}
                      event={eventForEdit}/>
      </div>
    )
  }
}

export default compose(
  DragDropContext(HTML5Backend),
  connect(state => ({
    events: state.project.events
  }), {})
)(Calendar);