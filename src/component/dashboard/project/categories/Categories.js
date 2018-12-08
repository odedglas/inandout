import React, {Component} from 'react';
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import DynamicIcon from "@common/DynamicIcon";
import PageTitle from "@common/PageTitle";
import CreateCategory from '@modal/CreateCategory'
import {ProjectContext} from '../ProjectContext';
import CategoryCard from './CategoryCard';

import Zoom from '@material-ui/core/Zoom';
class Categories extends Component {

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

    const {showCreateCategoryModal, editCategory} = this.state;

    return (
      <div className={'categories-container'}>
        <Breadcrumb item={{id: 'categoriesCrumb', value: 'Categories'}}/>

        <PageTitle text={'Categories'} icon={'categories'}/>
        <ProjectContext.Consumer>
          {(projectContext) => (
            <div>
              <div className={'row px-2'}>
                {projectContext.categories.map(
                  category => <CategoryCard key={category.id}
                                            project={projectContext.project}
                                            editCategory={(category) => this.showHideCreateCategory(true, category)}
                                            category={category} />
                )}
              </div>

              <CreateCategory open={showCreateCategoryModal}
                              category={editCategory}
                              project={projectContext.project}
                              onClose={this.showHideCreateCategory}/>
            </div>
          )}
        </ProjectContext.Consumer>

        <Tooltip title={'Create Category'} placement={'top'}>
          <Zoom in={true} timeout={400}>
            <Fab color="secondary"
                 onClick={() => this.showHideCreateCategory(true)}
                 aria-label="add"
                 classes={{'root': 'fab'}}>
              <DynamicIcon name={'add'}/>
            </Fab>
          </Zoom>
        </Tooltip>
      </div>
    );
  }
}

export default connect(null, {})(Categories);