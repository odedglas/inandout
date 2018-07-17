import PropTypes from 'prop-types'

import {CategoryType} from "./category";
import {TransactionType} from "./transaction";
import {BudgetType} from "./budget";

export const ProjectType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  budgets: PropTypes.arrayOf(BudgetType),
  categories: PropTypes.arrayOf(CategoryType),
  excludedCategories: PropTypes.arrayOf(PropTypes.string),
  identifier: PropTypes.string,
  owner: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
  currency: PropTypes.string,
  transactions: PropTypes.arrayOf(TransactionType),
});
