import PropTypes from 'prop-types'

import {CategoryType} from "./category";

export const TransactionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['income', 'outcome']),
  income: PropTypes.bool.isRequired,
  owner: PropTypes.string.isRequired,
  category: CategoryType,
  customerId: PropTypes.string,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  recurring: PropTypes.bool.isRequired,
  parentTransactionId: PropTypes.string,
  attachments: PropTypes.array
});
