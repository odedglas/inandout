import PropTypes from 'prop-types'

import {CategoryType} from "./category";
import {TransactionType} from "./transaction";

export const BudgetType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  actual: PropTypes.number.isRequired,
  warningLimit: PropTypes.number,
  categories: PropTypes.arrayOf(CategoryType),
  lastTransactions: PropTypes.arrayOf(TransactionType)
});
