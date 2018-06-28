import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Breadcrumbs extends Component {

  static propTypes = {
    project: PropTypes.object
  };

  render () {

    const { project } = this.props;

    return (
      <div className={'breadcrumbs px-4'}>

        <div className={'breadcrumb project-breadcrumb'}>
          <span className={'description'}>Project: </span>
          <span className={'value'}>{project.name} </span>
        </div>
      </div>
    );
  }
}

export default Breadcrumbs;