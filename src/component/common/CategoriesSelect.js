import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateCategory from '@modal/CreateCategory'
import DynamicIcon from "@common/DynamicIcon";

import {CategoryType} from "@model/category";

const MenuProps = {
  PaperProps: {
    style: {
      transform: 'translate3d(0, 0, 0)',
      maxHeight: 300,
      width: 250,
    },
  },
};

class CategoriesSelect extends Component {

  static propTypes = {
    selectedCategories: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    categories: PropTypes.arrayOf(CategoryType),
    selectedProject: PropTypes.object,
    multi: PropTypes.bool.isRequired,
    helperText: PropTypes.string,
  };

  state = {
    open: false,
    showCreateCategoryModal: false,
    data:[]
  };

  static getDerivedStateFromProps(props, state) {

    return {
      data: props.categories.filter(c => !c.excluded)
    }
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  showHideCreateCategory = (show) => {

    this.setState({
      showCreateCategoryModal: !!show
    })
  };

  handleCreateCategory = category => {

    const {selectedCategories, onChange} = this.props;

    onChange([
      category.id,
      ...selectedCategories
    ])
  };

  render() {

    const {
      selectedCategories,
      selectedProject,
      onChange,
      error,
      multi,
      helperText,
    } = this.props;

    const {showCreateCategoryModal, data} = this.state;

    return (
      <FormControl className={'form-control mselect'} error={error}>
        <InputLabel htmlFor="select-multiple-categories">{multi ? 'Categories' : 'Category'}</InputLabel>
        <Select
          multiple={multi}
          open={this.state.open}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          value={selectedCategories}
          onChange={(event) => {
            const isOption = event.currentTarget.getAttribute('data-value') !== 'add-category';
            if (isOption) {
              onChange(event.target.value);
            }
            else {
              this.handleClose()
            }
          }}
          input={<Input className={'w-100'} id="select-multiple-categories"/>}
          renderValue={selected => (
            <div style={{'whiteSpace': 'initial'}}>
              {
                (Array.isArray(selected) ? selected : [selected]).map(value => {

                const category = data.find(c => c.id === value);

                return (
                  <Chip key={category.id}
                        className={'ml-2 mt-2'}
                        avatar={
                          <Avatar className={'avatar smaller'} style={{'backgroundColor': category.color}}>
                            <DynamicIcon className={'icon white'} name={category.icon}/>
                          </Avatar>
                        }
                        label={category.name}/>
                )
              })}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {data.map(category => (
            <MenuItem
              key={category.id}
              value={category.id}>
              <ListItemIcon className={'menu-icon'}>
                <Avatar className={'avatar small'} style={{'backgroundColor': category.color}}>
                  <DynamicIcon className={'icon white'} name={category.icon}/>
                </Avatar>
              </ListItemIcon>
              <ListItemText className={'menu-text'}
                            primary={category.name}/>
            </MenuItem>
          ))}

          <div key={'add-category'} value={'add-category'} className={'flex'}>
            <Button size="small" color="primary" style={{'flex': 1}} onClick={() => this.showHideCreateCategory(true)}>
              <DynamicIcon name={'add'}/>
              Add new Category
            </Button>
          </div>

        </Select>

        { helperText ? <FormHelperText> { helperText }</FormHelperText> : null}

        <CreateCategory open={showCreateCategoryModal}
                        project={selectedProject}
                        createCallback={this.handleCreateCategory}
                        onClose={this.showHideCreateCategory}/>
      </FormControl>
    )
  }
}

export default connect(state => ({
  categories: state.project.categories,
  selectedProject: state.project.selectedProject
}), {})(CategoriesSelect);

