import PropTypes from 'prop-types'

export const CustomerType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  initials: PropTypes.string,
  avatarColor: PropTypes.string,
  contactName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  logo: PropTypes.string,
  star: PropTypes.bool
});
