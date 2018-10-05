import React from 'react';

import Paper from '@material-ui/core/Paper';
import ProjectInOutChart from './ProjectInOutChart';
import ProjectExpenseByChart from './ProjectExpenseByChart';

export default ({transactions, categories}) => {

  return (
    <div className={'col-sm-12 px-0 row my-4'}>

      <div className={'col-sm-12 '}>
        <Paper className={'project-statistics p-3 row'}>

          <div className={'col-sm-12 px-0 title mb-3'}>
            Statistics
          </div>
          <div className={'col-sm-11 col-md-9 pr-3'}>
            <ProjectInOutChart transactions={transactions}/>
          </div>
          <div className={'col-sm-11 mt-sm-3 col-md-3 mt-md-0 px-0'}>
            <ProjectExpenseByChart transactions={transactions}
                                   categories={categories}/>
          </div>
        </Paper>
      </div>
    </div>
  );
}