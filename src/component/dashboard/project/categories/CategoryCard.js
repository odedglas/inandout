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
import {removeCategory} from "@action/project";
import {showConfirmation} from "@action/dashboard";

class CategoryCard extends Component {

  static propTypes = {
    category: CategoryType,
    editCategory: PropTypes.func.isRequired,
    removeCategory: PropTypes.func.isRequired,
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

  handleCategoryRemove = () => {

    const {category, removeCategory, showConfirmation, project} = this.props;

    this.handleMenuClose();

    showConfirmation({
      title:'Remove This Category ?',
      body: 'Removing this category will cause all it\'s related transactions / budgets to become un-categorized and loose context.',
      icon: 'delete',
      onConfirm: () => {

        removeCategory(project, category.id, !category.isCustom);
      }
    });

  };

  render() {

    const {category} = this.props;
    const { anchorEl } = this.state;

    const canEdit = category.isCustom;

    return (
      <div className={'category col-sm-12 col-md-3'} key={category.id}>
        <div className={'menu-holder w-100'}>
          <IconButton className={'category-menu-trigger'}
                      aria-label="More"
                      aria-owns={anchorEl ? 'long-menu' : null}
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

            <MenuItem key={'category-delete'} onClick={this.handleCategoryRemove}>
              Remove
            </MenuItem>

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
  removeCategory,
  showConfirmation
})(CategoryCard);