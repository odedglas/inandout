import PropTypes from 'prop-types'

export const defaultCategories = [
  {
    name: 'Car and Transportation',
    id: '1237',
    color: '#EF9A9A',
    icon: 'transportation'
  },
  {
    name: 'Clothing',
    id: '12349',
    color: '#F48FB1',
    icon: 'cloth'
  },
  {
    name: 'Eating out',
    id: '12348',
    color: '#CE93D8',
    icon: 'eating'
  },
  {
    name: 'Entertainment',
    id: '12347',
    color: '#B39DDB',
    icon: 'entertainment'
  },
  {
    name: 'Fitness',
    id: '12346',
    color: '#9FA8DA',
    icon: 'fitness'
  },
  {
    name: 'Groceries',
    id: '123ssss45',
    color: '#90CAF9',
    icon: 'groceries'
  },
  {
    name: 'Health',
    id: '1234545',
    color: '#81C784',
    icon: 'medical'
  },
  {
    name: 'Insurance',
    id: '1234555',
    color: '#4FC3F7',
    icon: 'insurance'
  },
  {
    name: 'House Hold',
    id: '1232345',
    color: '#80CBC4',
    icon: 'home'
  },
  {
    name: 'Drinks and Party',
    id: '123231345',
    color: '#B0BEC5',
    icon: 'drinks'
  },
  {
    name: 'Electronics',
    id: '1231445',
    color: '#BCAAA4',
    icon: 'electronic'
  },
  {
    name: 'Cigarettes',
    id: '123144522',
    color: '#595959',
    icon: 'smoke'
  },
  {
    name: 'Pets',
    id: '12314452sss2',
    color: '#FFCC80',
    icon: 'pets'
  },
  {
    name: 'Education',
    id: '12314452ssss2',
    color: '#FFAB91',
    icon: 'education'
  },
  {
    name: 'Family',
    id: '1231445s2ssss2',
    color: '#BA68C8',
    icon: 'family'
  },
];

export const CategoryType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  isCustom: PropTypes.bool
});
