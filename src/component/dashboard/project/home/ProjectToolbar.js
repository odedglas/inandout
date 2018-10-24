import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DynamicIcon from '@common/DynamicIcon';

import dateUtil from '@util/date';

class ProjectToolbar extends React.Component {

  static propTypes = {
    selectedDate: PropTypes.object,
  };

  render() {

    const {selectedDate} = this.props;

    return (
      <div className={'transaction-toolbar col-sm-12 px-0'}>

        <div className={'months-navigator mx-2'}>
          <Button
            //color="secondary" onClick={setSelectedForToday}
            size="small">
            Today
          </Button>
          <Tooltip title="Show Previous Month" enterDelay={300}>
            <IconButton className={'icon-button ml-2'}
                        aria-label="Previous Month"
              //onClick={() => onSelectedDateChange(true)}
                        size={'small'}>
              <DynamicIcon name={'left'}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Show Next Month" enterDelay={300}>
            <IconButton className={'icon-button'}
              //onClick={() => onSelectedDateChange(false)}
                        aria-label="Next Month"
                        size={'small'}>
              <DynamicIcon name={'right'}/>
            </IconButton>
          </Tooltip>

          <span className={'selected-month mx-3'}>
          {dateUtil.format(selectedDate, 'MMM YYYY')}
        </span>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  selectedDate: state.project.selectedDate,
}), {})(ProjectToolbar);
