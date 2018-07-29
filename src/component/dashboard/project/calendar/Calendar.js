import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

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
  constructor(props) {
    super(props);
    this.state = {
      events: events,
    };

  }

  moveEvent = ({ event, start, end })=>{
    const { events } = this.state;

    const idx = events.indexOf(event);

    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents,
    })

  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents,
    })

  };

  newEvent = (event) =>{

    if(event.slots.length === 1) {
      console.log(event);
    }
  };

  render() {
    return (
      <DragAndDropCalendar
        className={'calendar'}
        selectable
        popup
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizable
        views={{month: true, week: true, day: true}}
        step={60}
        showMultiDayTimes
        onEventResize={this.resizeEvent}
        onSelectSlot={this.newEvent}
        onSelectEvent={(x) => {debugger;}}
        defaultView={BigCalendar.Views.MONTH}
        defaultDate={new Date()}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(Calendar);