const firebase = require("firebase-admin");

exports.transactionCreate = (snapshot, context) => {

  const {projectKey, monthYearKey} = context.params;
  const transaction = snapshot.val();
  console.log("Working Create on : ", transaction)
  return projectBalanceSync(projectKey, monthYearKey, getTransactionAmount(transaction.amount, transaction.income))
};

exports.transactionUpdate = (change, context) => {

  const {projectKey, monthYearKey} = context.params;

  const beforeTransaction = change.before.val();
  const afterTransaction = change.after.val();

  const deltaTransaction = afterTransaction.amount - beforeTransaction.amount;
  console.log("Working Update on : ", afterTransaction)
  return projectBalanceSync(projectKey, monthYearKey, getTransactionAmount(deltaTransaction, afterTransaction.income))
};

exports.transactionDelete = (snapshot, context) => {

  const {projectKey, monthYearKey} = context.params;
  const transaction = snapshot.val();

  console.log("Working Delete on : ", transaction)
  return projectBalanceSync(projectKey, monthYearKey, getTransactionAmount(transaction.amount * -1, transaction.income))
};

const getTransactionAmount = (amount, income) => amount * (income ? 1 : -1);

const projectBalanceSync = (projectKey, monthYearKey, amount) => {

  let balanceRef = firebase.database().ref(`/projects/${projectKey}/balance/${monthYearKey}`);
  return balanceRef.once('value').then(snapshot => {

    const val = snapshot.val();
    console.log("Val is", val);
    const currentBalance = val ? val.value : 0;
    console.log("currentBalance is", currentBalance);
    console.log("nextAmount is ", amount);
    const nextBalance = currentBalance + amount;
    console.log("nextBalance is", nextBalance);
    return balanceRef.set({value: nextBalance});
  });

};