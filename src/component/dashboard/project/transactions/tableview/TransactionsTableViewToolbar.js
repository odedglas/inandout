import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import DynamicIcon from '@common/DynamicIcon';
import util from '@util/';
import dateUtil from '@util/date';

export default ({date, filter, onSelectedDateChange, handleFilterChange, setSelectedForToday, showFilter}) => {

  const hasFilter = filter.some(f => !util.isEmptyObject(f.value));
  return (
    <Toolbar className={'transaction-toolbar col-sm-12 row px-0'}>
      <div className={'col-sm-12 px-0 flex'}>

        <div className={'months-navigator mx-2'}>
          <Button size="small"
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
        <div className={'spacer row'}>
          <div className={'col-sm-1'} />
          <div className={'col-sm-8 summary'}>
            <div className={'text-center'}>
              Summary
            </div>
            <div>
              Content
            </div>
          </div>
          <div className={'col-sm-3'} />
        </div>
        <div className={'filter-wrapper mx-2'}>
          {
            hasFilter ? <Button size="small" className={'button--xs ml-2'}
                                onClick={() => handleFilterChange([])}
                                color="primary">
              Clear
            </Button> : null
          }
          <Tooltip title="Filter List">
            <IconButton aria-label="Filter List" className={`filter ${hasFilter ? 'active' : ''}`} onClick={showFilter}>
              <FilterListIcon/>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Toolbar>
  );
};