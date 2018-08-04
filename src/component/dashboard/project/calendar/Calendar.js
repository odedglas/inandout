import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dateUtils from '@util/date';
import {CSSTransition} from 'react-transition-group';
import EventsPopper from './EventsPopper';

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const events = [
  {
    id: 14,
    title: 'Today sss',
    start: new Date(new Date()),
    end: new Date(new Date()),
  },
  {
    id: 15,
    title: 'Today44 sss',
    start: new Date(new Date()),
    end: new Date(new Date()),
  },
  {
    id: 16,
    title: 'Today 666sss',
    start: new Date(new Date()),
    end: new Date(new Date()),
  },
];

class Calendar extends Component {

  state = {
    events,
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
      start: event.start,
      end: event.end
    };

    //Finding slot dom
    const slotDom = document.querySelector(`.slot_${dateUtils.format(newEvent.start, 'DDMMYY')}`);

    slotDom.classList.add('popper-focus');
    this.handleClick(slotDom)
  };

  handleEventClick = event => {

    const eventDom = document.querySelector(`.event_${event.id}`);
    this.handleClick(eventDom, event)
  };

  handleClick = (target, event) => {
    debugger;
    this.setState({
      anchorEl: target,
      open: true,
      event: event || {},
    });
  };

  handleClose = () => {
    this.state.anchorEl.classList.remove('popper-focus');
    this.setState({
      anchorEl: null,
      open: false,
    });
  };

  eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event);
    let backgroundColor = '#' + event.hexColor;
    let style = {
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  render() {

    const {open, anchorEl, event} = this.state;

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
          events={this.state.events}
          onEventDrop={this.moveEvent}
          resizable
          views={{month: true, week: true, day: true}}
          step={60}
          eventStyleGetter={this.eventStyleGetter}
          dayPropGetter={(d) => ({
            className: `slot_${dateUtils.format(d, 'DDMMYY')}`,
          })}
          eventPropGetter={(e) => ({className: `event_${e.id}`})}
          showMultiDayTimes
          onSelectSlot={this.handleSlotClick}
          onSelectEvent={this.handleEventClick}
          defaultView={BigCalendar.Views.MONTH}
          defaultDate={new Date()}
        />

        <EventsPopper open={open}
                      anchorEl={anchorEl}
                      handleClose={this.handleClose}
                      event={event} />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Calendar);