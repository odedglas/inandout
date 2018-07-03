import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import DynamicIcon from "@common/DynamicIcon";
import PageTitle from "@common/PageTitle";
import CreateCategory from '@modal/CreateCategory'

import CategoryCard from './CategoryCard';

import Zoom from '@material-ui/core/Zoom';

class Categories extends Component {

  static propTypes = {
    selectedProject: PropTypes.any,
    categories: PropTypes.array,
  };

  state = {
    showCreateCategoryModal: false,
    editCategory: {},
  };

  showHideCreateCategory = (show, category) => {

    this.setState({
      showCreateCategoryModal: !!show,
      editCategory: category || {}
    })
  };

  render() {
    const {selectedProject, categories} = this.props;
    const {showCreateCategoryModal, editCategory} = this.state;

    return (
      <div className={'categories-container'}>
        <Breadcrumb item={{id: 'categoriesCrumb', value: 'Categories', path: '/dashboard'}}/>

        <PageTitle text={'Categories'} icon={'categories'}/>

        <div className={'row px-4'}>
          {categories.map(
            category => <CategoryCard key={category.id}
                                      project={selectedProject}
                                      editCategory={(category) => this.showHideCreateCategory(true, category)}
                                      category={category} />
          )}
        </div>

        <CreateCategory open={showCreateCategoryModal}
                           category={editCategory}
                           project={selectedProject}
                           onClose={this.showHideCreateCategory}/>

        <Tooltip title={'Create Category'} placement={'top'}>
          <Zoom in={true} timeout={400}>
            <Button variant="fab"
                    color="secondary"
                    onClick={() => this.showHideCreateCategory(true)}
                    aria-label="add"
                    className={'fab'}>
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
  categories: state.category.categories,
}), {})(Categories);