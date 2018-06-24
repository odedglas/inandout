import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grow from '@material-ui/core/Grow';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PersonIcon from '@material-ui/icons/Person';

import { PROJECT_TYPES } from '@const/';
import util from '@util/';
import validationService from '@service/validation';

const INITIAL_STATE = {
  projectType: '',
  projectName: '',
  validation: undefined,
};

class CreateProjectModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {...INITIAL_STATE};

  constructor(props) {
    super(props);
    this.validator = validationService.create([
      {
        field    : 'projectName',
        method   : (v, f, state, validator, args) => !validator.isEmpty(v),
        message  : 'Please provide a project name address.'
      },
      {
        field    : 'projectName',
        method   : (v, f, state, validator, args) => validator.isLength(v, {min:4}),
        message  : 'Project name must be at least 4 letters.'
      },
      {
        field    : 'projectType',
        method   : (v, f, state, validator, args) => !validator.isEmpty(v),
        message  : 'Please choose project type.'
      },
    ]);
  }

  handleChange = (value, name) => {
    let update = {};
    update[name] = value;

    //Validating against new input
    const currentValidation = this.state.validation;
    if(currentValidation) {
      //Setting new value
      let newState = {...this.state};
      newState[name] = value;

      //Extracting the specific field results, and overrides our component validation state
      currentValidation[name] = validationService.validate(this.validator, newState, name)[name];
      update.validation = currentValidation;
    }

    this.setState(update);
  };

  getSelectedProjectLabel = key => util.searchInConst(PROJECT_TYPES, key);

  createProject = () => {

    this.setState({ validation : undefined });
    const validationResult = validationService.validate(this.validator, this.state);

    if(validationResult.isValid) {
      console.log("valid. Creating project wiht : " + this.state.projectName);

      this.handleClose();
    }
    else {

      this.setState({ validation: validationResult })
    }
  };

  handleClose = () => {
    this.setState(...INITIAL_STATE);
    this.props.onClose();
  };

  render() {

    const { open } = this.props;
    const { projectType, projectName, validation } = this.state;

    const isValid = !validation || validation.isValid;
    console.log("Is valid is : " + isValid);

    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Grow}
          transitionDuration={300}
          className={'modal'}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className={'modal-title'}>Create New Project</DialogTitle>
          <DialogContent className={'modal-content'}>
            <DialogContentText>
              To create a new project, Fill up it's name and choose your template.
            </DialogContentText>
            <div className={'form-control'}>
              <TextField
                autoFocus
                value={projectName}
                error={validation && validation.projectName.isInvalid}
                onChange={(event) => this.handleChange(event.target.value, 'projectName')}
                margin="dense"
                id="project-name"
                label="Project Name"
                type="email"
                fullWidth
              />
            </div>

            <FormControl className={'form-control'} error={validation && validation.projectType.isInvalid}>
              <InputLabel htmlFor="project-type">Project Type</InputLabel>
              <Select
                value={projectType}
                fullWidth
                onChange={(event) => this.handleChange(event.target.value, 'projectType')}
                renderValue={(v) => this.getSelectedProjectLabel(v)}
                inputProps={{
                  name: 'project-type',
                  id: 'project-type',
                }}
              >

                <MenuItem value={PROJECT_TYPES.HOUSE_HOLD.key}>
                  <ListItemIcon className={'menu-icon'}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText className={'menu-text'}
                                secondary={PROJECT_TYPES.HOUSE_HOLD.description}
                                primary={PROJECT_TYPES.HOUSE_HOLD.label}/>
                </MenuItem>

                <MenuItem value={PROJECT_TYPES.SMALL_BUSINESS.key}>
                  <ListItemIcon className={'menu-icon'}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText className={'menu-text'}
                                secondary={PROJECT_TYPES.SMALL_BUSINESS.description}
                                primary={<span> {PROJECT_TYPES.SMALL_BUSINESS.label} </span>} />
                </MenuItem>
              </Select>
            </FormControl>

          </DialogContent>
          <DialogActions className={'modal-actions'}>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.createProject}
                    color="primary"
                    variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CreateProjectModal;
