import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CreationModal from './CreationModal';
import DynamicIcon from '@common/DynamicIcon';

import withValidation from '../hoc/withValidation';
import { createProject } from "@action/projects";
import { PROJECT_TYPES, CURRENCIES } from '@const/';
import util from '@util/';

class CreateProjectModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    createProject: PropTypes.func.isRequired,
  };

  modalContent = (model, validation, handleChange) => (
    <div>
      <div className={'form-control'}>
        <TextField
          autoFocus
          value={model.projectName}
          error={validation.projectName.isInvalid}
          placeholder={'My awesome project'}
          onChange={(event) => handleChange(event.target.value, 'projectName')}
          id="project-name"
          label="Project Name"
          title={validation.projectName.message}
          fullWidth
        />
      </div>

      <FormControl className={'form-control'} error={validation && validation.projectType.isInvalid}>
        <InputLabel htmlFor="project-type">Project Type</InputLabel>
        <Select
          value={model.projectType}
          fullWidth
          className={'dicks'}
          MenuProps={{'className': 'select-project-type'}}
          onChange={(event) => handleChange(event.target.value, 'projectType')}
          renderValue={(v) => this.getSelectedProjectLabel(v)}
          inputProps={{
            name: 'project-type',
            id: 'project-type',
          }}
        >

          <MenuItem value={PROJECT_TYPES.PERSONAL.key}>
            <ListItemIcon className={'menu-icon'}>
              <DynamicIcon name={'person'}/>
            </ListItemIcon>
            <ListItemText className={'menu-text'}
                          secondary={PROJECT_TYPES.PERSONAL.description}
                          primary={PROJECT_TYPES.PERSONAL.label}/>
          </MenuItem>

          <MenuItem value={PROJECT_TYPES.HOUSE_HOLD.key}>
            <ListItemIcon className={'menu-icon'}>
              <DynamicIcon name={'home'}/>
            </ListItemIcon>
            <ListItemText className={'menu-text'}
                          secondary={PROJECT_TYPES.HOUSE_HOLD.description}
                          primary={PROJECT_TYPES.HOUSE_HOLD.label}/>
          </MenuItem>

          <MenuItem value={PROJECT_TYPES.SMALL_BUSINESS.key}>
            <ListItemIcon className={'menu-icon'}>
              <DynamicIcon name={'smallBusiness'}/>
            </ListItemIcon>
            <ListItemText className={'menu-text'}
                          secondary={PROJECT_TYPES.SMALL_BUSINESS.description}
                          primary={<span> {PROJECT_TYPES.SMALL_BUSINESS.label} </span>} />
          </MenuItem>

          <MenuItem value={PROJECT_TYPES.MEDIUM_BUSINESS.key}  disabled={true}>
            <ListItemIcon className={'menu-icon'}>
              <DynamicIcon name={'mediumBusiness'}/>
            </ListItemIcon>
            <ListItemText className={'menu-text'}
                          secondary={PROJECT_TYPES.MEDIUM_BUSINESS.description}
                          primary={<span> {PROJECT_TYPES.MEDIUM_BUSINESS.label} </span>} />
          </MenuItem>
        </Select>
      </FormControl>

      <div className={'form-control'}>
        <TextField
          value={model.balance}
          error={validation.balance.isInvalid}
          onChange={(event) => handleChange(event.target.value, 'balance')}
          label={`Initial Balance`}
          title={validation.balance.message}
          fullWidth
        />

      </div>

      <div className={'form-control'}>
        <TextField
          select
          fullWidth
          error={validation.projectCurrency.isInvalid}
          placeholder={'Please select your currency'}
          label="Project Currency"
          value={model.projectCurrency}
          onChange={(event) => handleChange(event.target.value, 'projectCurrency')}
        >
          {CURRENCIES.map(option => (
            <MenuItem key={option.key} value={option.key}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

      </div>

      <div className={'form-control'}>
        <TextField
          value={model.projectDescription}
          onChange={(event) => handleChange(event.target.value, 'projectDescription')}
          label="Project Description"
          id="project-description"
          fullWidth
        />
      </div>
    </div>
  );

  getSelectedProjectLabel = key => util.searchInConst(PROJECT_TYPES, key);

  createProject = (model, close) => {

    const { createProject } = this.props;

    createProject(
      model,
      (project) => {

        close();
        this.props.history.push({
          pathname: '/dashboard/project/' + project.identifier,
        });
      }
    )
  };

  render() {
    const {
      open,
      validation,
      clearValidation,
      validate,
      onClose,
      onValidationChange,
    } = this.props;

    const editMode = false;
    const model = {};

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     title={ editMode ? 'Edit Project' : 'Create Project'}
                     context={' To create a new project, Fill up it\'s name and choose your template.'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       projectType: '',
                       projectName: '',
                       projectCurrency: '',
                       projectDescription: '',
                       balance: '0',
                     })}
                     renderContent={this.modalContent}
                     onCreate={this.createProject}
                     validate={validate}
                     validation={validation}
                     onValidationChange={onValidationChange}
                     clearValidation={clearValidation}/>
    );
  }
}

export default compose(
  withRouter,
  withValidation([
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
    {
      field    : 'balance',
      method   : (v, f, state, validator, args) => validator.isNumeric(v),
      message  : 'Please choose a valid project balance ( Negative or positive .'
    },
    {
      field    : 'projectCurrency',
      method   : (v, f, state, validator, args) => !validator.isEmpty(v),
      message  : 'Please choose project currency.'
    },
  ]),
  connect( null, {createProject})
)(CreateProjectModal);
