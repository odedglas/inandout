import React from 'react';
import Spinner from '../common/Spinner'
import {
  ProgressCircular
} from 'react-onsenui'
const Dashboard = () =>
  <div>
    <h1>Dashboard</h1>
    <Spinner />
    <ProgressCircular indeterminate/>
  </div>

export default Dashboard;