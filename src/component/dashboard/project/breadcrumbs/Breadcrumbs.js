import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import util from '@util/'
import Hidden from '@material-ui/core/Hidden';
import ProjectMembersMenu from '@common/ProjectMembersMenu';

import {toggleProjectDrawer} from '@action/project';

class Breadcrumbs extends Component {

  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
    toggleProjectDrawer: PropTypes.func.isRequired
  };

  handleItemClick = (item) => {

    !item.render && this.props.history.push(item.path)
  };

  render() {

    const {breadcrumbs, toggleProjectDrawer} = this.props;
    const length = breadcrumbs.length;
    return (
      <div className={'breadcrumbs pl-sm-0 pl-md-4 pr-4'}>

        <Hidden mdUp>
          <Button className={'open-drawer'}
                  size="small" color="primary"
                  onClick={() => toggleProjectDrawer(true)}>
            <MenuIcon/>
          </Button>
        </Hidden>

        {breadcrumbs.map((breadcrumb, i) => {

          const isSingle = length === 1;
          const isLast = i === length - 1;
          const isEmpty = util.isUndefined(breadcrumb.value);

          const breadcrumbItemClassList = `breadcrumb ${isLast ? 'active' : ''} ${isSingle ? 'single' : ''} ${isEmpty ?
            'empty' : ''}`;

          return (
            <div className={'breadcrumb-holder'} key={breadcrumb.id}>
              <div className={breadcrumbItemClassList} onClick={() => !isLast && this.handleItemClick(breadcrumb)}>
                {!breadcrumb.render ? breadcrumb.value : breadcrumb.render(breadcrumb.value)}
              </div>
              {!isLast ? <span className={'divider mx-2'}> / </span> : null}
            </div>
          )
        })}

        <div className={'flex'}></div>
        <ProjectMembersMenu />
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    breadcrumbs: state.breadcrumbs,
  }), {toggleProjectDrawer})
)(Breadcrumbs);
