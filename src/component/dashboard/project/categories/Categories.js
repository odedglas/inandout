import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import DynamicIcon from "@common/DynamicIcon";
import PageTitle from "@common/PageTitle";

import Zoom from '@material-ui/core/Zoom';

class Categories extends Component {

  static propTypes = {
    selectedProject: PropTypes.any,
    categories: PropTypes.array
  };

  showCreateCategory = () => {

  };

  render() {
    const {selectedProject, categories} = this.props;

    return (
      <div className={'categories-container'}>
        <Breadcrumb item={{id: 'categoriesCrumb', value: 'Categories', path: '/dashboard'}}/>

        <PageTitle text={'Categories'} icon={'categories'}/>

        <div className={'row px-4'}>
          {categories.map(category => {

            return (
              <div className={'category col-sm-12 col-md-3'} key={category.id}>
                <div>
                  <Avatar style={{'backgroundColor': category.color}}>
                    <DynamicIcon name={category.icon}/>
                  </Avatar>
                </div>
                <div className={'category-name mt-3 py-2'}>
                  {category.name}
                </div>
              </div>
            )
          })}
        </div>
        <Tooltip title={'Create Category'} placement={'top'}>
          <Zoom in={true} timeout={400}>
            <Button variant="fab"
                    color="secondary"
                    onClick={this.showCreateCategory}
                    aria-label="add"
                    className={'add-category'}>
              <DynamicIcon name={'add'}/>
            </Button>
          </Zoom>
        </Tooltip>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
  categories: state.category.defaultCategories,
}), {})(Categories);