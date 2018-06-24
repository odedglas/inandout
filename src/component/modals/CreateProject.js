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
import withValidation from '../hoc/withValidation';

import { PROJECT_TYPES } from '@const/';
import util from '@util/';

const INITIAL_STATE = {
  projectType: '',
  projectName: '',
};

class CreateProjectModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
  };

  state = {...INITIAL_STATE};

  handleChange = (value, name) => {
    let update = {};
    update[name] = value;

    //Validating against new input
    this.props.onValidationChange(this.state, update, name);
    this.setState(update);
  };

  getSelectedProjectLabel = key => util.searchInConst(PROJECT_TYPES, key);

  createProject = () => {

    const validationResult = this.props.validate(this.state);

    if(validationResult.isValid) {
      console.log("valid. Creating project wiht : " + this.state.projectName);
      this.handleClose();
    }

  };

  handleClose = () => {
    this.props.clearValidation();
    this.setState({...INITIAL_STATE});
    this.props.onClose();
  };

  render() {

    const { open, validation} = this.props;
    const { projectType, projectName } = this.state;

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
                error={validation.projectName.isInvalid}
                onChange={(event) => this.handleChange(event.target.value, 'projectName')}
                margin="dense"
                id="project-name"
                label="Project Name"
                title={validation.projectName.message}
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

export default withValidation([
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
])(CreateProjectModal);
