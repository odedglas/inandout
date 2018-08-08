import React from 'react';
import util from '@util/'

export default ({indicatorColor, actual, limit, usage}) => {

  const progressSpanStyle = {
    width: `${usage}%`,
  };

  return (
    <div className={'budget-usage pt-2'}>
      <div className={'actuals py-2'}>
        <span>
          { util.formatNumber(actual) } / { util.formatNumber(limit) }
        </span>
        <span className={`usage ${indicatorColor}-indicator`}>{usage}% </span>
      </div>
      <div className={'progress-bar my-2'}>
        <span className={`${indicatorColor}-background`} style={progressSpanStyle}></span>
      </div>
    </div>
  )
}
