import moment from 'moment'
import {BUDGETS_PERIOD} from '@const/'
import {TRANSACTIONS_DATE_KEY_FORMAT} from '@const/'

const baseFormat = 'DD/MM/YY';
const shortFormat = 'MMM Do YY';
const shortDateFormat = 'MMM Do';
const monthShortFormat = 'MMM YY';
const yearMonthFormat = "MMYY";
const longMonthYearDisplayFormat = "MMM YYYY";
const budgetPeriodMap = BUDGETS_PERIOD.reduce((map, bp) => {
  map[bp.key] = bp;
  return map;
},{});

export default {

  monthYearKey: (date) => moment(date).format(TRANSACTIONS_DATE_KEY_FORMAT),

  format: (date, format) => moment(date).format(format || baseFormat),

  formantMothYearLong: (date) => moment(date).format(longMonthYearDisplayFormat),

  formatShortMont: (date) => moment(date).format(monthShortFormat),

  formatShortDate: (date) => moment(date).format(shortDateFormat),

  fromNow: (date) => moment(date).fromNow(),

  now: () => {
    const now = new Date();
    return now.getTime();
  },

  sameDay: (d1, d2) => moment(d2).diff(moment(d1), 'days') === 0,

  sameMonth: (d1, d2) => moment(d1).format(yearMonthFormat) === moment(d2).format(yearMonthFormat),

  between: (range, d) => {
    const date = moment(d);
    return date.isAfter(range.startDate) && date.isBefore(range.endDate)
  },

  dayDiff: (startDate, endDate) => moment(endDate).diff(moment(startDate), 'days'),

  next: (date, unit = 1, amount = 'month') => {

    return moment(date).add(amount, unit).toDate();
  },

  prev: (date, unit, amount) => {

    return moment(date).subtract(amount, unit).toDate();
  },

  isAfter: (d1, d2) => moment(d1).isAfter(d2),

  isBefore: (d1, d2) => moment(d1).isBefore(d2),

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

  startOf(date, unit = 'month') {

    return moment(date).startOf(unit)
  },

  endOf(date, unit = 'month') {

    return moment(date).endOf(unit)
  },

  periodRange(date, format, unit) {

    return {
      start: this.format(this.startOf(date, unit), format),
      end: this.format(this.endOf(date, unit), format)
    }
  },

  getBudgetRange (period, selectedDate)  {

    let d = moment(selectedDate);

    const budgetPeriod = budgetPeriodMap[period];

    return {
      startDate:d.startOf(budgetPeriod.period).toDate(),
      endDate:d.endOf(budgetPeriod.period).toDate(),
      statisticsPeriod: budgetPeriod.statisticsPeriod
    }
  },

  budgetRangeFormat: (date) => moment(date).format(shortFormat),

  beforeOrEqualBalanceKey: (balanceKey, dateKey) => {

    return  balanceKey === dateKey || moment(balanceKey, yearMonthFormat).isBefore(moment(dateKey, yearMonthFormat))
  }
}