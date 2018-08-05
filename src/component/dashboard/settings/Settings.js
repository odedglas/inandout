import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

import { selectProject } from "@action/project";
import DynamicIcon from "../../common/DynamicIcon";

class Settings extends React.Component {

  static propTypes = {
    user: PropTypes.object,
  };

  render() {

    const {history, user} = this.props;

    return (
      <div className={'settings-page scrollable'}>

        <div className={'header'}>
          <IconButton className={'icon'} onClick={history.goBack}>
            <DynamicIcon  name={'back'}/>
          </IconButton>
          <span className={'title mx-2'}>
            Settings
          </span>
        </div>
        <div className={'body'}>

          <Paper className={'p-3'}>
            Settings body for { user.displayName }
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    user: state.user,
  }), {})
)(Settings);