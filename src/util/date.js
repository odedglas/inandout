import moment from 'moment'
import {BUDGETS_PERIOD} from '@const/'
import {TRANSACTIONS_DATE_KEY_FORMAT} from '@const/'

const baseFormat = 'DD/MM/YY';
const budgetPeriodMap = BUDGETS_PERIOD.reduce((map, bp) => {
  map[bp.key] = bp;
  return map;
},{});

export default {

  monthYearKey: (date) => moment(date).format(TRANSACTIONS_DATE_KEY_FORMAT),

  format: (date, format) => moment(date).format(format || baseFormat),

  fromNow: (date) => moment(date).fromNow(),

  sameMonth: (d1, d2) => moment(d1).format("MMYY") === moment(d2).format("MMYY"),

  between: (range, d) => {
    const date = moment(d);
    return date.isAfter(range.startDate) && date.isBefore(range.endDate)
  },

  dayDiff: (startDate, endDate) => moment(endDate).diff(moment(startDate), 'days'),

  next: (date, unit, amount) => {

    return moment(date).add(amount, unit).toDate();
  },

  prev: (date, unit, amount) => {

    return moment(date).subtract(amount, unit).toDate();
  },

  isAfter: (d1, d2) => moment(d1).isAfter(d2),

  isBefore: (d1, d2) => moment(d1).isBefore(d2),

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