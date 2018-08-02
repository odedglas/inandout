import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import dateUtils from '@util/date';

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
    this.handleClick(eventDom)
  };

  handleClick = target => {
    this.setState({
      anchorEl: target,
      open: true,
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

    const {open, anchorEl} = this.state;

    return (
      <div style={{position: 'relative'}}>
        {
          open ? <div className={'calendar-mask'}></div> : null
        }
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
            ariaDescribedBy: 'calendar-popper'
          })}
          eventPropGetter={(e) => ({className: `event_${e.id}`})}
          showMultiDayTimes
          onSelectSlot={this.handleSlotClick}
          onSelectEvent={this.handleEventClick}
          defaultView={BigCalendar.Views.MONTH}
          defaultDate={new Date()}
        />

        <Popper open={open}
                className={'calendar-popper'}
                anchorEl={anchorEl}
                id={'calendar-popper'}
                placement={'right-end'} transition>
          {({TransitionProps}) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Fade {...TransitionProps} timeout={350}>

                <Paper>
                  <Typography>The content of the Popper.</Typography>
                </Paper>

              </Fade>
            </ClickAwayListener>
          )}
        </Popper>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Calendar);