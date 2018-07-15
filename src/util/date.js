import moment from 'moment'
import {BUDGETS_PERIOD} from '@const/'
import util from '@util/'
const baseFormat = 'DD/MM/YY';

const budgetPeriodMap = BUDGETS_PERIOD.reduce((map, bp) => {
  map[bp.key] = bp;
  return map;
},{});

export default {

  format: (date, format) => moment(date).format(format || baseFormat),

  fromNow: (date) => moment(date).fromNow(),

  dayDiff: (startDate, endDate) => moment(endDate).diff(moment(startDate), 'days'),

  getBudgetRange (period)  {

    let d = moment();

    const budgetPeriod = budgetPeriodMap[period];

    return {
      startDate:d.startOf(budgetPeriod.period).toDate(),
      endDate:d.endOf(budgetPeriod.period).toDate(),
      statisticsPeriod: budgetPeriod.statisticsPeriod
    }
  }
}