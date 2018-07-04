import moment from 'moment'

const baseFormat = 'DD/MMM/YY';

export default {

  format: (date, format) => moment(date).format(format || baseFormat),

  fromNow: (date) => moment(date).fromNow(),

  dayDiff: (startDate, endDate) => moment(endDate).diff(moment(startDate), 'days'),
}