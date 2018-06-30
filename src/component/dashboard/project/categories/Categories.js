import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import TransportationIcon from '../../../icon/TransportationIcon';
import ClothIcon from '../../../icon/ClothIcon';
import HomeIcon from '@material-ui/icons/Home';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import SmokeIcon from '@material-ui/icons/SmokingRooms';
import DrinksIcon from '@material-ui/icons/LocalBar';
import EatingIcon from '@material-ui/icons/Restaurant';
import PetsIcon from '@material-ui/icons/Pets';
import MedicIcon from '@material-ui/icons/LocalPharmacy';
import GroceriesIcon from '@material-ui/icons/LocalGroceryStore';
import InsurancesIcon from '@material-ui/icons/CardMembership';
import ElectornicsIcon from '@material-ui/icons/DeveloperBoard';
import EducationIcon from '@material-ui/icons/School';
import EntertaimentIcon from '@material-ui/icons/MusicNote';

import Zoom from '@material-ui/core/Zoom';

const categories = [
  {
    name:'Car and Transportation',
    id:'1237',
    color: '#EF9A9A',
    icon: <TransportationIcon/>
  },
  {
    name:'Clothing',
    id:'12349',
    color: '#F48FB1',
    icon: <ClothIcon/>
  },
  {
    name:'Eating out',
    id:'12348',
    color: '#CE93D8',
    icon: <EatingIcon/>
  },
  {
    name:'Entertainment',
    id:'12347',
    color: '#B39DDB',
    icon: <EntertaimentIcon/>
  },
  {
    name:'Fitness',
    id:'12346',
    color: '#9FA8DA',
    icon: <FitnessIcon/>
  },
  {
    name:'Groceries',
    id:'123ssss45',
    color: '#90CAF9',
    icon: <GroceriesIcon/>
  },  
  {
    name:'Health',
    id:'1234545',
    color: '#81D4FA',
    icon: <MedicIcon/>
  },
  {
    name:'Insurance',
    id:'1234555',
    color: '#80DEEA',
    icon: <InsurancesIcon/>
  },
  {
    name:'House Hold',
    id:'1232345',
    color: '#80CBC4',
    icon: <HomeIcon/>
  },
  {
    name:'Drinks and Party',
    id:'123231345',
    color: '#B0BEC5',
    icon: <DrinksIcon/>
  },
  {
    name:'Electronics',
    id:'1231445',
    color: '#BCAAA4',
    icon: <ElectornicsIcon/>
  },
  {
    name:'Cigarettes',
    id:'123144522',
    color: '#595959',
    icon: <SmokeIcon/>
  },
  {
    name:'Pets',
    id:'12314452sss2',
    color: '#FFCC80',
    icon: <PetsIcon/>
  },
  {
    name:'Education',
    id:'12314452ssss2',
    color: '#FFAB91',
    icon: <EducationIcon/>
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
            <AddIcon/>
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