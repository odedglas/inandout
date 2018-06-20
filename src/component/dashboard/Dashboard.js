import React from 'react';
import Spinner from '../common/Spinner';
import Navigation from '../common/Navigation';
import CircularProgress from '@material-ui/core/CircularProgress';

const Dashboard = () =>
  <div>
    <h1>Dashboard</h1>
    <Spinner />
    <Navigation/>
    <CircularProgress/>
  </div>

export default Dashboard;