import React from 'react';

// -- Categories -- //
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

// -- Custom Categories -- //
import GiftIcon from '@material-ui/icons/CardGiftcard';
import GamesIcon from '@material-ui/icons/Games';
import MusicIcon from '@material-ui/icons/MusicNote';
import ToysIcon from '@material-ui/icons/Toys';
import CreationIcon from '@material-ui/icons/Brush';
import FlowersIcon from '@material-ui/icons/LocalFlorist';
import MoviesIcon from '@material-ui/icons/LocalMovies';
import OutdoorIcon from '@material-ui/icons/Terrain';
import KitchenIcon from '@material-ui/icons/Kitchen';
import SeaIcon from '@material-ui/icons/BeachAccess';
import HotIcon from '@material-ui/icons/Whatshot';
import GlobalIcon from '@material-ui/icons/Public';
import CakeIcon from '@material-ui/icons/Cake';
import CoffeeIcon from '@material-ui/icons/LocalCafe';
import GasIcon from '@material-ui/icons/LocalGasStation';
import FlightIcon from '@material-ui/icons/LocalAirport';
import ElectricityIcon from '@material-ui/icons/SettingsInputHdmi';
import PrintIcon from '@material-ui/icons/Print';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BuildIcon from '@material-ui/icons/Build';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import WorkIcon from '@material-ui/icons/Work';
import SecurityIcon from '@material-ui/icons/Security';

// -- Actions -- //
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/CheckBox';

// -- Drawer -- //
import TodosIcon from '@material-ui/icons/CheckBox';
import BudgetsIcon from '@material-ui/icons/AttachMoney';
import TransactionsIcon from '@material-ui/icons/Transform';
import CustomersIcon from '@material-ui/icons/Group';
import CalendarIcon from '@material-ui/icons/DateRange';
import NotificationsIcon  from '@material-ui/icons/Notifications';

// -- Other -- //
import ShowChart from '@material-ui/icons/ShowChart';
import HistoryIcon from '@material-ui/icons/History';
import OutcomeIcon from '@material-ui/icons/TrendingDown';
import IncomeIcon from '@material-ui/icons/TrendingUp';
import OverviewIcon from '@material-ui/icons/PanoramaFishEye';
import LeftChevIcon from '@material-ui/icons/ChevronLeft';
import RightChevIcon from '@material-ui/icons/ChevronRight';
import DisabledIcon from '@material-ui/icons/NotInterested';
import StatEmptyIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import PaletteIcon from '@material-ui/icons/Palette';
import LocationIcon from '@material-ui/icons/LocationOn';
import BackIcon from '@material-ui/icons/ArrowBack';
import ActionMenuIcon from '@material-ui/icons/KeyboardArrowDown';
import ShareIcon from '@material-ui/icons/Share';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import toArrowIcon from '@material-ui/icons/TrendingFlat';
import ProjectMembersIcon from '@material-ui/icons/GroupWork';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ChequeIcon from '../icon/ChequeIcon';

// -- Social Media --//
import GoogleIcon from '../icon/GoogleIcon';
import TwitterIcon from '../icon/TwitterIcon';
import FacebookIcon from '../icon/FacebookIcon';
import GithubIcon from '../icon/GithubIcon';

const CashIcon = BudgetsIcon;

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
  'task': TodosIcon,
  'customers': CustomersIcon,
  'calendar': CalendarIcon,
  'notification': NotificationsIcon,
  'gift': GiftIcon,
  'games': GamesIcon,
  'music': MusicIcon,
  'toys': ToysIcon,
  'creation': CreationIcon,
  'flower': FlowersIcon,
  'movie': MoviesIcon,
  'outdoor': OutdoorIcon,
  'kitchen': KitchenIcon,
  'sea': SeaIcon,
  'hot': HotIcon,
  'cake': CakeIcon,
  'coffee': CoffeeIcon,
  'global': GlobalIcon,
  'gas': GasIcon,
  'flight': FlightIcon,
  'delete': DeleteIcon,
  'edit': EditIcon,
  'cancel': CancelIcon,
  'chart': ShowChart,
  'history': HistoryIcon,
  'outcome': OutcomeIcon,
  'income': IncomeIcon,
  'overview': OverviewIcon,
  'close': CloseIcon,
  'left': LeftChevIcon,
  'right': RightChevIcon,
  'disable': DisabledIcon,
  'star-empty': StatEmptyIcon,
  'star': StarIcon,
  'search': SearchIcon,
  'palette': PaletteIcon,
  'location': LocationIcon,
  'back': BackIcon,
  'actionMenu': ActionMenuIcon,
  'google': GoogleIcon,
  'twitter': TwitterIcon,
  'facebook': FacebookIcon,
  'github': GithubIcon,
  'share': ShareIcon,
  'balance': AccountBalanceIcon,
  'toArrow': toArrowIcon,
  'projectMembers': ProjectMembersIcon,
  'check': CheckIcon,
  'addShop': AddShoppingCartIcon,
  'assignment': AssignmentIcon,
  'build': BuildIcon,
  'favorite': FavoriteIcon,
  'print': PrintIcon,
  'electricity': ElectricityIcon,
  'work': WorkIcon,
  'security': SecurityIcon,
  'cash': CashIcon,
  'credit': CreditCardIcon,
  'cheque': ChequeIcon,
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