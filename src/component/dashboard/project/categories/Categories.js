import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import DynamicIcon from "@common/DynamicIcon";

import Zoom from '@material-ui/core/Zoom';

const categories = [
  {
    name:'Car and Transportation',
    id:'1237',
    color: '#EF9A9A',
    icon: <DynamicIcon name={'transportation'} />
  },
  {
    name:'Clothing',
    id:'12349',
    color: '#F48FB1',
    icon: <DynamicIcon name={'cloth'} />
  },
  {
    name:'Eating out',
    id:'12348',
    color: '#CE93D8',
    icon: <DynamicIcon name={'eating'} />
  },
  {
    name:'Entertainment',
    id:'12347',
    color: '#B39DDB',
    icon: <DynamicIcon name={'entertainment'} />
  },
  {
    name:'Fitness',
    id:'12346',
    color: '#9FA8DA',
    icon: <DynamicIcon name={'fitness'} />
  },
  {
    name:'Groceries',
    id:'123ssss45',
    color: '#90CAF9',
    icon: <DynamicIcon name={'groceries'} />
  },  
  {
    name:'Health',
    id:'1234545',
    color: '#81D4FA',
    icon: <DynamicIcon name={'medical'} />
  },
  {
    name:'Insurance',
    id:'1234555',
    color: '#80DEEA',
    icon: <DynamicIcon name={'insurance'} />
  },
  {
    name:'House Hold',
    id:'1232345',
    color: '#80CBC4',
    icon: <DynamicIcon name={'home'} />
  },
  {
    name:'Drinks and Party',
    id:'123231345',
    color: '#B0BEC5',
    icon: <DynamicIcon name={'drinks'} />
  },
  {
    name:'Electronics',
    id:'1231445',
    color: '#BCAAA4',
    icon: <DynamicIcon name={'electronic'} />
  },
  {
    name:'Cigarettes',
    id:'123144522',
    color: '#595959',
    icon:<DynamicIcon name={'smoke'} />
  },
  {
    name:'Pets',
    id:'12314452sss2',
    color: '#FFCC80',
    icon: <DynamicIcon name={'pets'} />
  },
  {
    name:'Education',
    id:'12314452ssss2',
    color: '#FFAB91',
    icon: <DynamicIcon name={'education'} />
  },
  {
    name:'Family',
    id:'1231445s2ssss2',
    color: '#BA68C8',
    icon: <DynamicIcon name={'family'} />
  },
];

class Categories extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  showCreateCategory = () => {

  };

  render() {
    const { selectedProject } = this.props;

    return (
      <div className={'categories-container'}>
        <Breadcrumb item={{id:'categoriesCrumb' ,value:'Categories', path:'/dashboard'}}/>

        <div className={'row px-4'}>
          { categories.map( category => {

            return (
              <div className={'category col-sm-12 col-md-3'} key={category.id}>
                <div>
                  <Avatar style={{'backgroundColor': category.color}}>
                    {category.icon}
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
}), {})(Categories);