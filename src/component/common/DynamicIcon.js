import React from 'react';

import TransportationIcon from '../icon/TransportationIcon';
import ClothIcon from '../icon/ClothIcon';
import CategoriesIcon from '../icon/CategoriesIcon';

import HomeIcon from '@material-ui/icons/Home';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import SmokeIcon from '@material-ui/icons/SmokingRooms';
import DrinksIcon from '@material-ui/icons/LocalBar';
import EatingIcon from '@material-ui/icons/Restaurant';
import PetsIcon from '@material-ui/icons/Pets';
import MedicIcon from '@material-ui/icons/LocalPharmacy';
import GroceriesIcon from '@material-ui/icons/LocalGroceryStore';
import InsurancesIcon from '@material-ui/icons/CardMembership';
import ElectronicIcon from '@material-ui/icons/DeveloperBoard';
import EducationIcon from '@material-ui/icons/School';
import EntertainmentIcon from '@material-ui/icons/Spa';
import FamilyIcon from '@material-ui/icons/ChildFriendly';
import PersonIcon from '@material-ui/icons/Person';
import SmallBusinessIcon from '@material-ui/icons/LocalGroceryStore';
import MediumBusinessIcon from '@material-ui/icons/LocalMall';
import AddIcon from '@material-ui/icons/Add';

import TodosIcon from '@material-ui/icons/CheckBox';
import BudgetsIcon from '@material-ui/icons/AttachMoney';
import TransactionsIcon from '@material-ui/icons/Transform';
import CustomersIcon from '@material-ui/icons/Group';
import CalendarIcon from '@material-ui/icons/DateRange';
import NotificationsIcon  from '@material-ui/icons/Notifications';

const iconMap = {
  'home': HomeIcon,
  'smoke': SmokeIcon,
  'cloth': ClothIcon,
  'transportation': TransportationIcon,
  'fitness': FitnessIcon,
  'drinks': DrinksIcon,
  'eating': EatingIcon,
  'pets': PetsIcon,
  'medical': MedicIcon,
  'groceries': GroceriesIcon,
  'insurance': InsurancesIcon,
  'electronic': ElectronicIcon,
  'education': EducationIcon,
  'entertainment': EntertainmentIcon,
  'family': FamilyIcon,
  'person': PersonIcon ,
  'smallBusiness': SmallBusinessIcon,
  'mediumBusiness': MediumBusinessIcon,
  'add': AddIcon,
  'categories': CategoriesIcon,
  'budgets': BudgetsIcon,
  'transactions': TransactionsIcon,
  'todo': TodosIcon,
  'customers': CustomersIcon,
  'calendar': CalendarIcon,
  'notification': NotificationsIcon,
};

const DynamicIcon = ({ name, ...iconProps}) => {

  let IconComponent = iconMap[name];
  if(!IconComponent) {
    console.error('Could not find icon with name : ' + name + ' under icon\'s map');
    return null;
  }

  return <IconComponent {...iconProps} />;
};

export default DynamicIcon;