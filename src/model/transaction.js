import PropTypes from 'prop-types'

import {CategoryType} from "./category";
import {CustomerType} from "./customer";

export const TransactionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  income: PropTypes.bool.isRequired,
  owner: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  category: PropTypes.oneOfType([CategoryType, PropTypes.string]),
  customer: PropTypes.oneOfType([CustomerType, PropTypes.string]),
  date: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  amount: PropTypes.number.isRequired,
  payments: PropTypes.number,
  paymentIndex: PropTypes.number,
});
