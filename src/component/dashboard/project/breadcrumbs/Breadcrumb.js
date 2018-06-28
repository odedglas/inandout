import {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const BreadcrumbType = PropTypes.shape({
  id:PropTypes.string.isRequired,
  value: PropTypes.string,
  path: PropTypes.string.isRequired,
  render: PropTypes.func,
});

class Breadcrumb extends Component {

  static propTypes = {
    item: BreadcrumbType,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let { item } = this.props;
    this.props.add(item)
  }

  componentWillReceiveProps(nextProps) {

    const{ item } = nextProps;
    const newValue = item.value;

    // Update the crumb if its data has changed
    let currentItem = this.props.item;

    if (newValue !== currentItem.value ) {
      console.log("Bread crumbs update, FROM:" + currentItem.value + " , TO:" + newValue);
      this.props.update({
        ...currentItem,
        value: newValue
      })
    }
  }

  componentWillUnmount() {

    this.props.remove(this.props.item);
  }

  render() {
    return null
  }
}

function mapDispatchToProps(dispatch) {
  return({
    add: (item) => {dispatch({type: 'ADD_CRUMB', payload: item})},
    update: (item) => {dispatch({type: 'UPDATE_CRUMB', payload: item})},
    remove: (item) => {dispatch({type: 'REMOVE_CRUMB', payload: item})},
  })
}

export default connect(null, mapDispatchToProps)(Breadcrumb);

