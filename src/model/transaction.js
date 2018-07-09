import PropTypes from 'prop-types'

import {CategoryType} from "./category";

export const TransactionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['income', 'outcome']),
  income: PropTypes.bool.isRequired,
  owner: PropTypes.object,
  category: CategoryType,
  customer: PropTypes.object,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  recurring: PropTypes.bool,
  parentTransactionId: PropTypes.string,
  attachments: PropTypes.array
});
