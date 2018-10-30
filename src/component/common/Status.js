import React from 'react';
import util from '@util/';
import {TRANSACTIONS_STATUS} from '@const/';

const Status = ({status, small}) => {

  const _status = util.getConst(TRANSACTIONS_STATUS, status);

  return (
    <div className={`status-indicator ${_status.className ? _status.className : ''} ${small ? 'small' : ''}`}>
      {_status.label}
    </div>
  )
};

export default Status;