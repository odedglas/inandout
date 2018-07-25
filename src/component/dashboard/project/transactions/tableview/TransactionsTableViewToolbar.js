import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import DynamicIcon from '@common/DynamicIcon';

import dateUtil from '@util/date';

export default ({date, filter, onSelectedDateChange, setSelectedForToday, showFilter, handleFilterChange}) => {
  return (
    <Toolbar className={'transaction-toolbar col-sm-12 px-0'}>

      <div className={'months-navigator mx-2'}>
        <Button size="small"
                disabled={dateUtil.sameMonth(new Date(), date)}
                variant={'outlined'}
                color="secondary" onClick={setSelectedForToday}>
          Today
        </Button>
        <Tooltip title="Previous Month" enterDelay={300}>
          <IconButton className={'icon-button ml-2'}
                      aria-label="Previous Month"
                      size={'small'}
                      onClick={() => onSelectedDateChange(true)}>
            <DynamicIcon name={'left'}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Month" enterDelay={300}>
          <IconButton className={'icon-button'}
                      onClick={() => onSelectedDateChange(false)}
                      aria-label="Next Month"
                      size={'small'}>
            <DynamicIcon name={'right'}/>
          </IconButton>
        </Tooltip>

        <span className={'selected-month mx-3'}>
          {dateUtil.format(date, 'MMM YYYY')}
        </span>
      </div>
      <div className={'spacer'}/>
      <div className={'action mx-2'}>
        <Tooltip title="Filter List">
          <IconButton aria-label="Filter List" onClick={showFilter}>
            <FilterListIcon/>
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};