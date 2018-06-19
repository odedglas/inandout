import React from 'react';
import Spinner from '../common/Spinner';
import Navigation from '../common/Navigation';
import {
  ProgressCircular
} from 'react-onsenui'

const Dashboard = () =>
  <div>
    <h1>Dashboard</h1>
    <Spinner />
    <ProgressCircular indeterminate/>
    <Navigation/>
  </div>

export default Dashboard;