import firebaseService from './firebase';
import util from '@util/'
import date from '@util/date'
import {TRANSACTIONS_DATE_KEY_FORMAT} from '@const/'

export default {

  transactionsDateKey(date) {

    return date.format(date, TRANSACTIONS_DATE_KEY_FORMAT);
  },

  createTransaction (projectId, transaction) {

    const dateKey = this.transactionsDateKey(transaction.date);

    return firebaseService.createTransaction(projectId, dateKey, transaction)
  },

  fetchMonthlyTransactions (projectKeys) {

    const monthlyKey = date.format(new Date(), TRANSACTIONS_DATE_KEY_FORMAT);

    return firebaseService.fetchByKeys('/transactions', projectKeys.map(pk => `${pk}/${monthlyKey}`), true).then(res => {

      return projectKeys.reduce((transactions, pk, i) => {

        transactions[pk] = res[i];
        return transactions;

      }, {});
    })
  },
  mergeTransactions (transactions, customers, categories, usersMap) {

    const customersMap = util.toIdsMap(customers);
    const categoriesMap = util.toIdsMap(categories);

    return transactions.map(transaction => {

      return {
        ...transaction,
        date: date.format(transaction.date),
        category: transaction.category ? categoriesMap[transaction.category] :  'UNCATEGORIZED',
        customer: transaction.customer ? customersMap[transaction.customer] : undefined,
        owner: usersMap[transaction.owner]
      }

    });
  },
}
