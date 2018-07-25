import firebaseService from './firebase';
import util from '@util/'
import dateUtil from '@util/date'
import {TRANSACTIONS_DATE_KEY_FORMAT, TRANSACTIONS_TYPE} from '@const/'

const transactionTypes = TRANSACTIONS_TYPE.reduce((map, item) => {
  map[item.key] = item.key;
  return map
},{});

export default {

  createTransactionSyncListener (projectId, date, callback) {

    return {
      ref: firebaseService.database.ref(`/transactions/${projectId}/${this.transactionsDateKey(date)}`),
      callback: (snap) => {
        const value = snap.val();
        const keys = value ? Object.keys(value) : [];

        const result = keys.map(key => {

          return {
            id: key,
            ...value[key]
          }
        });

        callback(result);
      }
    }
  },

  transactionsDateKey(date) {

    return _transactionDateKey(date);
  },

  getTransactionType: (transaction) => transaction.income ? transactionTypes.INCOME : transactionTypes.OUTCOME ,

  createTransaction (projectId, type, owner, description, category, customer, date, amount, payments) {

    const transaction = transformTransaction(type, owner, description, category, customer, date || new Date(), amount, payments);

    const dateKey = this.transactionsDateKey(transaction.date);
    debugger;
    return firebaseService.createTransaction(projectId, dateKey, transaction).then(t => {

      if(hasPayments(payments)) {

        //Creating following payment transaction
        const transactionTemplate = () => ({...transaction});
        const dateMap = createTransactionPaymentsMap(t.date, t.payments, t.paymentIndex);

        dateMap.forEach((dateWrapper) => {

          const paymentsTransaction = {
            ...transactionTemplate(),
            paymentIndex: dateWrapper.paymentIndex,
            date: dateWrapper.date
          };

          const updatePath = transactionPath(projectId, this.transactionsDateKey(dateWrapper.date), t.id);
          firebaseService.update(updatePath, paymentsTransaction);
        });

      }

      return t;
    })
  },

  updateTransaction (projectId, id, type, owner, description, category, customer, date, amount, payments, paymentIndex) {

    const transaction = transformTransaction(type, owner, description, category, customer, date, amount, payments, paymentIndex, true);

    const dateKey = this.transactionsDateKey(transaction.date);
    const updatePath = transactionPath(projectId, dateKey, id);

    return firebaseService.update(updatePath, transaction).then(() => {
      transaction.id = id;

      //Removing related if needed
      if(hasPayments(payments)) {

        //Creating following payment transaction
        const transactionTemplate = () => ({...transaction});
        const dateMap = createTransactionPaymentsMap(date, payments, paymentIndex);
        dateMap.forEach((dateWrapper) => {

          const paymentsTransaction = {
            ...transactionTemplate(),
            date: dateWrapper.date,
            paymentIndex: dateWrapper.paymentIndex
          };

          const updatePath = transactionPath(projectId, this.transactionsDateKey(dateWrapper.date), id);
          firebaseService.update(updatePath, paymentsTransaction);
        });
      }

      return transaction;
    });
  },

  deleteTransaction (projectId, id, date,payments, paymentIndex) {

    const transactionKey = this.transactionsDateKey(date);

    const path = transactionPath(projectId, transactionKey, id);

    return firebaseService.remove(path).then(() => {

      //Removing related if needed
      if(hasPayments(payments)) {

        //Creating following payment transaction
        const dateMap = createTransactionPaymentsMap(date, payments, paymentIndex);
        dateMap.forEach((dateWrapper) => {

          const removePath = transactionPath(projectId, this.transactionsDateKey(dateWrapper.date), id);
          firebaseService.remove(removePath);
        });
      }

      return {
        id,
        date
      }
    });
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

      return this.fillTransaction(
        transaction,
        customersMap,
        categoriesMap,
        usersMap
      )

    });
  },

  fillTransaction (transaction, customersMap, categoriesMap, usersMap)  {

    return {
      ...transaction,
      formattedDate: dateUtil.format(transaction.date),
      type: this.getTransactionType(transaction),
      category: transaction.category ? categoriesMap[transaction.category] :  undefined,
      customer: transaction.customer ? customersMap[transaction.customer] : undefined,
      owner: usersMap[transaction.owner]
    }

  }
}

const transactionPath = (projectId, monthKey, transactionId) => `/transactions/${projectId}/${monthKey}/${transactionId}`;

const transformTransaction = (type, owner, description, category, customer, date, amount, payments, paymentIndex, edit) => {

  const trueAmount = (!edit && hasPayments(payments)) ? +(amount / payments) : +amount;

  const transaction = {
    income: type === transactionTypes.INCOME,
    owner: owner.id,
    date: date instanceof Date ? date.getTime() : date,
    amount: Number(trueAmount.toFixed(2)),
  };

  if(description) transaction.description = description;
  if(category) transaction.category = category;
  if(customer) transaction.customer = customer;
  if(hasPayments) {
    transaction.paymentIndex = paymentIndex || 0;
    transaction.payments = +payments
  }

  return transaction;
};

const hasPayments = payments => !util.isUndefined(payments) && payments > 1;

const createTransactionPaymentsMap = (date, payments, paymentIndex) => {

  const dates = [];

  let paymentsDate = dateUtil.prev(date, 'month', paymentIndex);
  let index = 0;

  while(index < payments) {

    dates.push({
      date: paymentsDate.getTime(),
      paymentIndex: index,
      key: _transactionDateKey(paymentsDate)
    });

    paymentsDate = dateUtil.next(paymentsDate, 'month', 1);
    index++;
  }

  return dates.filter(d => d.date !== date);

};

const _transactionDateKey = (date) => dateUtil.format(date, TRANSACTIONS_DATE_KEY_FORMAT);