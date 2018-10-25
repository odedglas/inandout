import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DynamicIcon from '@common/DynamicIcon';

import {setSelectedDate} from '@action/project';
import dateUtil from '@util/date';
import {ProjectType} from "@model/project";

class ProjectToolbar extends React.Component {

  static propTypes = {
    selectedProject: ProjectType,
    selectedDate: PropTypes.object,
    setSelectedDate: PropTypes.func.isRequired,
  };

  handleSelectedDateChange = (prev, today) => {

    const {selectedProject, selectedDate} = this.props;

    const newSelected = dateUtil[prev ? 'prev' : 'next'](selectedDate, 'month', 1);

    this.props.setSelectedDate(selectedProject.id, today ? new Date() : newSelected);
  };

  render() {

    return (
      <div className={'project-toolbar col-sm-12 px-0'}>

        <div className={'months-navigator mx-2'}>
          <Button
            color="secondary" onClick={() => this.handleSelectedDateChange(false, true)}
            size="small">
            Today
          </Button>
          <IconButton className={'icon-button ml-2'}
                      aria-label="Previous Month"
                      onClick={() => this.handleSelectedDateChange(true)}
                      size={'small'}>
            <DynamicIcon name={'left'}/>
          </IconButton>
          <IconButton className={'icon-button'}
                      onClick={() => this.handleSelectedDateChange(false)}
                      aria-label="Next Month"
                      size={'small'}>
            <DynamicIcon name={'right'}/>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
  selectedDate: state.project.selectedDate,
}), {setSelectedDate})(ProjectToolbar);
