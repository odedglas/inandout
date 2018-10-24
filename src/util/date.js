import moment from 'moment'
import {BUDGETS_PERIOD} from '@const/'
import {TRANSACTIONS_DATE_KEY_FORMAT} from '@const/'

const baseFormat = 'DD/MM/YY';
const shortFormat = 'MMM Do YY';
const budgetPeriodMap = BUDGETS_PERIOD.reduce((map, bp) => {
  map[bp.key] = bp;
  return map;
},{});

export default {

  monthYearKey: (date) => moment(date).format(TRANSACTIONS_DATE_KEY_FORMAT),

  format: (date, format) => moment(date).format(format || baseFormat),

  fromNow: (date) => moment(date).fromNow(),

  now: () => {
    const now = new Date();
    return now.getTime();
  },

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
  },

  budgetRangeFormat: (date) => moment(date).format(shortFormat),

  getDatesBetween: (d1, d2, format) => {

    const start = moment(d1);
    const end =  moment(d2);

    let dates = [];

    while(start.isBefore(end)) {

      dates.push(start.format(format || baseFormat));
      start.set('day', start.day() + 1);
    }

    return dates;
  },

  startOf(date, unit) {

    return moment(date).startOf(unit)
  },

  endOf(date, unit = 'month') {

    return moment(date).endOf(unit)
  },
}