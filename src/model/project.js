import PropTypes from 'prop-types'

import {CategoryType} from "./category";
import {TransactionType} from "./transaction";
import {BudgetType} from "./budget";
import {EventType} from "./event";

export const ProjectType = PropTypes.shape({
  id: PropTypes.string,
  budgets: PropTypes.arrayOf(BudgetType),
  categories: PropTypes.arrayOf(CategoryType),
  excludedCategories: PropTypes.arrayOf(PropTypes.string),
  identifier: PropTypes.string,
  owner: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  name: PropTypes.string,
  type: PropTypes.string,
  currency: PropTypes.string,
  transactions: PropTypes.arrayOf(TransactionType),
  members: PropTypes.array,
  balance: PropTypes.object,
  events: PropTypes.arrayOf(EventType)
});
