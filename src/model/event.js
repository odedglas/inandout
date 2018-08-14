import PropTypes from 'prop-types'

export const EventType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  color: PropTypes.string.isRequired,
  customer: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  location: PropTypes.string,
  transaction: PropTypes.string,
});
