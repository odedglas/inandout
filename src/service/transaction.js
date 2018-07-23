import firebaseService from './firebase';
import util from '@util/'
import dateUtil from '@util/date'
import {TRANSACTIONS_DATE_KEY_FORMAT, TRANSACTIONS_TYPE} from '@const/'

const transactionTypes = TRANSACTIONS_TYPE.reduce((map, item) => {
  map[item.key] = item.key;
  return map
},{});

export default {

  transactionsDateKey(date) {

    return dateUtil.format(date, TRANSACTIONS_DATE_KEY_FORMAT);
  },

  getTransactionType: (transaction) => transaction.income ? transactionTypes.INCOME : transactionTypes.OUTCOME ,

  createTransaction (projectId, type, owner, description, category, customer, date, amount, payments) {

    const transaction = transformTransaction(type, owner, description, category, customer, date, amount, payments);

    const dateKey = this.transactionsDateKey(transaction.date);

    return firebaseService.createTransaction(projectId, dateKey, transaction)
  },

  updateTransaction (projectId, id, type, owner, description, category, customer, date, amount, payments) {

    const transaction = transformTransaction(type, owner, description, category, customer, date, amount, payments);

    const dateKey = this.transactionsDateKey(transaction.date);
    const updatePath = transactionPath(projectId, dateKey, id);

    return firebaseService.update(updatePath, transaction).then(() => {
      transaction.id = id;
      return transaction;
    });
  },

  deleteTransaction (projectId, transaction) {

    const transactionKey = this.transactionsDateKey(transaction.date);

    const path = transactionPath(projectId, transactionKey, transaction.id);

    return firebaseService.remove(path).then(() => transaction);
  },

  fetchMonthlyTransactions (projectKeys) {

    const monthlyKey = dateUtil.format(new Date(), TRANSACTIONS_DATE_KEY_FORMAT);

    return firebaseService.fetchByKeys('/transactions', projectKeys.map(pk => `${pk}/${monthlyKey}`), true).then(res => {

      return projectKeys.reduce((transactions, pk, i) => {

        transactions[pk] = res[i];
        return transactions;

      }, {});
    })
  },

  fetchTransactions (projectKey, monthKey) {

    return firebaseService.fetchArray(`/transactions/${projectKey}/${monthKey}`);
  },

  mergeTransactions (transactions, customers, categories, users) {

    const customersMap = util.toIdsMap(customers);
    const categoriesMap = util.toIdsMap(categories);
    const usersMap = util.toIdsMap(users);

    return transactions.map(transaction => {

      return {
        ...transaction,
        formattedDate: dateUtil.format(transaction.date),
        type: this.getTransactionType(transaction),
        category: transaction.category ? categoriesMap[transaction.category] :  undefined,
        customer: transaction.customer ? customersMap[transaction.customer] : undefined,
        owner: usersMap[transaction.owner]
      }

    });
  },
}

const transactionPath = (projectId, monthKey, transactionId) => `/transactions/${projectId}/${monthKey}/${transactionId}`;

const transformTransaction = (type, owner, description, category, customer, date, amount, payments) => {

  const transaction = {
    income: type === transactionTypes.INCOME,
    owner: owner.id,
    date,
    amount: +amount,
  };

  if(description) transaction.description = description;
  if(category) transaction.category = category;
  if(customer) transaction.customer = customer;
  if(payments) transaction.payments = payments;

  return transaction;
};