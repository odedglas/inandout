import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Breadcrumbs extends Component {

  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
  };

  render () {

    const { breadcrumbs } = this.props;
    const length = breadcrumbs.length;

    return (
      <div className={'breadcrumbs px-4'}>

        {breadcrumbs.map((breadcrumb, i) => {

          const isSingle = length === 1;
          const isLast = i === length-1;

          const breadcrumbItemClassList = `breadcrumb ${isLast ? 'active' : ''} ${isSingle ? 'single' : ''}`;

          return (
            <div className={'breadcrumb-holder'} key={breadcrumb.id}>
              <div className={breadcrumbItemClassList}>
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

export default connect( state => ({
  breadcrumbs: state.breadcrumbs,
}), {})(Breadcrumbs);
