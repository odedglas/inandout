import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withValidation from '@hoc/withValidation';
import DynamicIcon from "../../../common/DynamicIcon";
import ColorPicker from '@common/ColorPicker'
import {DateTimePicker} from 'material-ui-pickers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CustomersSelect from '@common/CustomersSelect';

import {createEvent, editEvent, deleteEvent} from "@action/project";
import {EVENT_TYPE} from '@const/'
import util from '@util/';
import themeService from '@service/theme';

const today = new Date();
const getEventsInitialState = () => ({
  type: 'EVENT',
  date: today.setHours(12),
  title: '',
  description: '',
  color: themeService.getAvatarRandomColor('600'),
  customer: '',
  location: '',
});

class EventsPopper extends Component {

  static propTypes = {
    selectedProject: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    event: PropTypes.object,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    createEvent: PropTypes.func.isRequired,
    editEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
  };

  state = {
    data: getEventsInitialState(),
    popperPickerOpen: false,
    eventTypeMenuAnchor: null,
    editMode: false,
  };

  componentDidUpdate(prevProps) {

    let open = this.props.open === true;
    const hasEntity = !util.isUndefined(this.props.event.id);

    if (open && !prevProps.open) {

      const initialState = getEventsInitialState();
      this.setState({
        data: {...initialState, ...this.props.event},
        editMode: hasEntity
      })
    }
  }

  handleChange = (val, field) => {

    const model = this.state.data;

    let update = model;
    update[field] = val;

    //Validating against new input
    this.props.onValidationChange(model, update, field);
    this.setState({data: update});
  };

  handleEventMenuOpen = event => {
    this.setState({eventTypeMenuAnchor: event.currentTarget});
    this.onPopperPickerOpen();
  };

  handleEventMenuClose = () => {
    this.setState({eventTypeMenuAnchor: null});
    this.onPopperPickerClose();
  };

  handlePopperClose = () => {

    if (!this.state.popperPickerOpen) {
      this.props.handleClose();
    }
  };

  onPopperPickerOpen = () => this.setState({popperPickerOpen: true});

  onPopperPickerClose = () => this.setState({popperPickerOpen: false});

  handleCreateOrEditEvent = () => {

    const {validate, selectedProject} = this.props;
    const {editMode} = this.state;
    const model = this.state.data;

    const validationResult = validate(model);
    if (validationResult.isValid) {

      const method = editMode ? 'editEvent' : 'createEvent';
      this.props[method](selectedProject, model, this.handlePopperClose);
    }
  };

  handleEventDelete = () => {

    this.handlePopperClose();
    this.props.deleteEvent(
      this.props.selectedProject,
      this.props.event.id
    )
  };

  getPopperContent = (isEventType) => {

    const {validation} = this.props;
    const {data, eventTypeMenuAnchor, editMode} = this.state;

    const eventTypeLabel = util.searchInConst(EVENT_TYPE, data.type);
    return (
      <div className={'content'}>

        <div className={'form-control'}>

          <TextField
            value={data.title}
            title={validation.title.message}
            error={validation.title.isInvalid}
            onChange={(event) => this.handleChange(event.target.value, 'title')}
            margin="dense"
            placeholder="Add Title"
            fullWidth
          />
        </div>

        {
          !editMode ?
            <div className={'form-control'}>
              <Chip aria-owns={eventTypeMenuAnchor ? 'event-type-menu' : null}
                    onClick={this.handleEventMenuOpen}
                    aria-haspopup="true"
                    label={eventTypeLabel}/>
            </div>
            :
            null
        }

        <Menu
          id="event-type-menu"
          anchorEl={eventTypeMenuAnchor}
          open={Boolean(eventTypeMenuAnchor)}
          onClose={this.handleEventMenuClose}>

          {EVENT_TYPE.map(option => (
            <MenuItem key={option.key} value={option.key} onClick={() => {
              this.handleChange(option.key, 'type');
              this.handleEventMenuClose()
            }}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        <div className={'form-control'}>
          <div className="picker">
            <DateTimePicker
              value={data.date}
              title={validation.date.message}
              error={validation.date.isInvalid}
              onOpen={this.onPopperPickerOpen}
              onClose={this.onPopperPickerClose}
              onChange={(date) => this.handleChange(date.toDate().getTime(), 'date')}
              placeholder="Date"
              fullWidth
            />
          </div>
        </div>

        <CustomersSelect customer={data.customer}
                         onClose={this.onPopperPickerClose}
                         onOpen={this.onPopperPickerOpen}
                         onChange={(val) => this.handleChange(val, 'customer')}/>

        {
          isEventType ?
            <TextField
              value={data.location}
              onChange={(event) => this.handleChange(event.target.value, 'location')}
              margin="dense"
              placeholder="Location"
              fullWidth
            /> : null
        }

      </div>
    )
  };

  calculatedPlacement = () => {
    const {anchorEl} = this.props;

    const defaultPlacement = 'right-start';

    if (!anchorEl) return defaultPlacement;

    const body = document.body,
      html = document.documentElement;

    const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    const anchorTop = anchorEl ? anchorEl.getClientRects()[0].top : 0;

    return anchorTop > (bodyHeight / 2) ? 'right-end' : defaultPlacement
  };

  render() {

    const {open, anchorEl} = this.props;
    const {data, editMode} = this.state;

    const isEventType = data.type === 'EVENT';

    return (
      <Popper open={open}
              className={'calendar-popper'}
              anchorEl={anchorEl}
              placement={this.calculatedPlacement()} transition>
        {({TransitionProps}) => (
          <ClickAwayListener onClickAway={this.handlePopperClose}>
            <Grow {...TransitionProps} timeout={350}>

              <Paper className={'p-0'}>
                <div className={'header flex'} style={{backgroundColor: data.color}}>
                  <div className={'title'}>
                    <DynamicIcon name={isEventType ? 'calendar' : 'task'} className={'mr-2'}/>
                    {`${editMode ? 'Edit' : 'Create'} ${isEventType ? 'Event' : 'Task'}`}
                  </div>
                  <div style={{flex: 2}}></div>
                  <div className={'flex'}>

                    <ColorPicker selectedColor={data.color}
                                 beforeShow={this.onPopperPickerOpen}
                                 beforeHide={this.onPopperPickerClose}
                                 onChange={color => this.handleChange(color, 'color')}>
                      <IconButton style={{color: 'white'}}>
                        <DynamicIcon name={'palette'}/>
                      </IconButton>
                    </ColorPicker>

                    <IconButton onClick={this.handlePopperClose} style={{color: 'white'}}>
                      <CloseIcon/>
                    </IconButton>
                  </div>
                </div>
                {this.getPopperContent(data, isEventType)}
                <div className={'footer'}>
                  {
                    editMode ? <IconButton onClick={this.handleEventDelete}>
                      <DynamicIcon name={'delete'}/>
                    </IconButton> : null
                  }
                  <div className={'flex'}></div>
                  <Button onClick={this.handlePopperClose}
                          size={'small'}
                          className={'mx-3'}
                          color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleCreateOrEditEvent}
                          color="primary"
                          size={'small'}
                          variant="contained">
                    {editMode ? 'Edit' : 'Create'}
                  </Button>
                </div>
              </Paper>

            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    )
  }
}

export default compose(
  withValidation([
    {
      field: 'title',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please fill the event title.'
    },
    {
      field: 'date',
      method: (v, f, state, validator, args) => !validator.isEmpty('' + v),
      message: 'Please select event date.'
    },
    {
      field: 'customer',
      method: (v, f, state, validator, args) => true
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject
  }), {createEvent, editEvent, deleteEvent})
)(EventsPopper);