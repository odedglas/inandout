import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';
import util from '@util/'

class Breadcrumbs extends Component {

  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
  };

  handleItemClick = (item) => {

    !item.render && this.props.history.push(item.path)
  };

  render () {

    const { breadcrumbs } = this.props;
    const length = breadcrumbs.length;

    return (
      <div className={'breadcrumbs px-4'}>

        {breadcrumbs.map((breadcrumb, i) => {

          const isSingle = length === 1;
          const isLast = i === length-1;
          const isEmpty = util.isUndefined(breadcrumb.value);

          const breadcrumbItemClassList = `breadcrumb ${isLast ? 'active' : ''} ${isSingle ? 'single' : ''} ${isEmpty ? 'empty' : ''}`;

          return (
            <div className={'breadcrumb-holder'} key={breadcrumb.id}>
              <div className={breadcrumbItemClassList} onClick={() => !isLast && this.handleItemClick(breadcrumb)}>
                {!breadcrumb.render ? breadcrumb.value : breadcrumb.render(breadcrumb.value)}
              </div>
              {!isLast ? <span className={'divider mx-2'}> / </span> : null }
            </div>
          )
        })}

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect( state => ({
    breadcrumbs: state.breadcrumbs,
  }), {})
)(Breadcrumbs);