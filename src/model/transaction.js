import PropTypes from 'prop-types'

import {CategoryType} from "./category";

export const TransactionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  income: PropTypes.bool.isRequired,
  owner: PropTypes.object,
  category: PropTypes.oneOfType([CategoryType, PropTypes.string]),
  customer: PropTypes.object,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  payments: PropTypes.string,
});
