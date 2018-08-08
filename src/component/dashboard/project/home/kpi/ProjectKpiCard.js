import React from 'react';
import Paper from '@material-ui/core/Paper';

export default ({title, badgeText, className, body}) => {

  const cls = `project-kpi ${className ? className : ''}`;

  return (
    <Paper className={cls}>
      <div className={'card-header'}>
        <div className={'title'}> {title}</div>
        {badgeText ? <div className={'badge'}> {badgeText} </div> : null}
      </div>
      <div className={'card-body mt-3'}>
        {body}
      </div>
    </Paper>
  )
}


//#9cadc2