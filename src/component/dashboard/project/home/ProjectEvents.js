import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {TransactionType} from "@model/transaction";
import {DIRECTIONS} from '@const/';

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}


class ProjectTransactions extends React.Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
  };

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {

    const direction = DIRECTIONS.LTR;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={direction}>Item One</TabContainer>
          <TabContainer dir={direction}>Item Two</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}



export default ProjectTransactions;