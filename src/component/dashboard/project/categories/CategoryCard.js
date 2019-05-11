import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import DynamicIcon from "@common/DynamicIcon";
import {CategoryType} from '@model/category'
import {excludeCategory, includeCategory} from "@action/project";
import {showConfirmation} from "@action/dashboard";

class CategoryCard extends Component {

  static propTypes = {
    category: CategoryType,
    editCategory: PropTypes.func.isRequired,
    excludeCategory: PropTypes.func.isRequired,
    includeCategory: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    project: PropTypes.object,
  };

  state = {
    anchorEl: null,
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCategoryEdit = () => {

    const {category, editCategory} = this.props;
    this.handleMenuClose();

    editCategory(category);
  };

  handleCategoryExclude = () => {

    const {category, excludeCategory, showConfirmation, project} = this.props;

    this.handleMenuClose();

    showConfirmation({
      title:'Exclude This Category ?',
      body: 'Excluding this category will prevent it being added for new Transactions/Budgets.',
      icon: 'delete',
      onConfirm: () => {

        excludeCategory(project, category);
      }
    });

  };

  handleCategoryInclude = () => {

    this.handleMenuClose();

    const {category, includeCategory, project} = this.props;

    includeCategory(project, category);
  };

  render() {

    const {category} = this.props;
    const { anchorEl } = this.state;

    const excluded = category.excluded;
    const canEdit = !excluded;

    return (
      <div className={`category col-sm-12 col-md-3 ${excluded ? 'excluded' : ''}`} key={category.id}>
        {
          excluded ? <div className={'excluded-mask'}>
            <div className={'content col-flex flex-center'}>
              <DynamicIcon className={'icon'} name={'disable'}/>
              <span className={'text'}> Excluded </span>
            </div>
          </div> : null
        }
        <div className={'menu-holder w-100'}>
          <IconButton className={'category-menu-trigger'}
                      aria-label="More"
                      size
                      aria-owns={anchorEl ? 'category-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="category-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}>

            {
              canEdit ? <MenuItem key={'category-edit'} onClick={this.handleCategoryEdit}>
                Edit
              </MenuItem> : null
            }

            {
              !excluded ? <MenuItem key={'category-delete'} onClick={this.handleCategoryExclude}>
                  Exclude
                </MenuItem> :
                <MenuItem key={'category-include'} onClick={this.handleCategoryInclude}>
                  Include
                </MenuItem>
            }
          </Menu>
        </div>
        <div>
          <Avatar style={{'backgroundColor': category.color}}>
            <DynamicIcon name={category.icon}/>
          </Avatar>
        </div>
        <div className={'category-name mt-3 py-2'}>
          {category.name}
        </div>
      </div>
    );
  }
}

export default connect(null, {
  excludeCategory,
  includeCategory,
  showConfirmation
})(CategoryCard);