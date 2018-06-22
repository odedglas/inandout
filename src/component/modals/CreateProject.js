import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grow from '@material-ui/core/Grow';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class CreateProjectModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    projectType: "",
  };

  handleProjectTypeChange = newType => this.setState({ projectType: newType });

  render() {

    const { open, onClose } = this.props;
    const { projectType } = this.state;

    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Grow}
          transitionDuration={400}
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
                margin="dense"
                id="project-name"
                label="Project Name"
                type="email"
                fullWidth
              />
            </div>

            <FormControl className={'form-control'}>
              <InputLabel htmlFor="project-type">Project Type</InputLabel>
              <Select
                value={projectType}
                fullWidth
                onChange={(event) => this.handleProjectTypeChange(event.target.value)}
                inputProps={{
                  name: 'project-type',
                  id: 'project-type',
                }}
              >

                <MenuItem value={'presonal'}>Personal</MenuItem>
                <MenuItem value={'houseHolding'}>House Holding</MenuItem>
                <MenuItem value={'smallBusiness'}>Small Business</MenuItem>
              </Select>
            </FormControl>

          </DialogContent>
          <DialogActions className={'modal-actions'}>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onClose} color="primary" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CreateProjectModal;
