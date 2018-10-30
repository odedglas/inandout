import firebaseService from './firebase';
import calendarService from './calendar';
import util from '@util/'
import dateUtil from '@util/date'
import {TRANSACTIONS_TYPE} from '@const/'

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

  createTransaction (projectId, type, owner, description, category, customer, date, amount, payments, paymentMethod, status, sourceEventId) {

    const transaction = transformTransaction(type, owner, description, category, customer, date || new Date(), amount, payments, false, undefined, paymentMethod, status);
    if(sourceEventId) transaction.sourceEventId = sourceEventId;

    const dateKey = this.transactionsDateKey(transaction.date);

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

  updateTransaction (projectId, id, type, owner, description, category, customer, date, amount, payments, paymentIndex, paymentMethod, status) {

    const transaction = transformTransaction(type, owner, description, category, customer, date, amount, payments, paymentIndex, true, paymentMethod, status);

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

  deleteTransaction (projectId, id, date, payments, paymentIndex, sourceEventId) {

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

      if(sourceEventId) {
        calendarService.detachEventTransaction(projectId, sourceEventId);
      }

      return {
        id,
        date
      }
    });
  },

  fetchMonthlyTransactions (projectKeys) {

    const monthlyKey = _transactionDateKey(new Date());

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

  },

  getTransactionsBalance (transactions) {

    let income = 0;
    let outcome = 0;

    const acceptedTransactions = this.filterAccepted(transactions);
    transactions.forEach(transaction => transaction.income ? income+= transaction.amount : outcome += transaction.amount);

    return {
      income,
      outcome,
      balance: income - outcome
    }
  },

  filterAccepted (transactions) {

    return transactions.filter(t => t.status === 'ACCEPTED');
  }
}

const transactionPath = (projectId, monthKey, transactionId) => `/transactions/${projectId}/${monthKey}/${transactionId}`;

const transformTransaction = (type, owner, description, category, customer, date, amount, payments, paymentIndex, edit, paymentMethod, status) => {

  const trueAmount = (!edit && hasPayments(payments)) ? +(amount / payments) : +amount;

  const transaction = {
    income: type === transactionTypes.INCOME,
    owner: owner.id,
    date: date instanceof Date ? date.getTime() : date,
    amount: Number(trueAmount.toFixed(2)),
    paymentMethod: paymentMethod ? paymentMethod : 'CREDIT',
    status: status ? status : 'ACCEPTED'
  };

  if(description) transaction.description = description;
  if(category) transaction.category = category;
  if(customer) transaction.customer = customer;
  if(hasPayments(payments)) {
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

const _transactionDateKey = (date) => dateUtil.monthYearKey(date);