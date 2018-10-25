import firebaseService from './firebase';
import transactionService from './transaction';
import budgetService from './budget';
import notificationService from './notification';
import util from '@util/'
import dateUtil from '@util/date'
import request from '@util/request';
import {CURRENCIES} from "@const/";

export default {
  createProjectPropertiesListener(projectId, balanceCallback, membersCallback) {

    return {
      'balance': {
        ref: firebaseService.database.ref(`/projects/${projectId}/balance`),
        callback: (snap) => balanceCallback(snap.val())
      },
      'members': {
        ref: firebaseService.database.ref(`/projects/${projectId}/members`),
        callback: (snap) => membersCallback(snap.val())
      }
    }
  },
  fetchUserProjects(projectKeys) {

    return firebaseService.fetchByKeys('/projects', projectKeys);
  },
  createProject(name, type, description, currency, balance) {

    const ownerId = firebaseService.user.uid;
    const now = new Date();
    const project = {
      name,
      type,
      description,
      currency,
      members: [ownerId],
      owner: ownerId,
      created: now.getTime(),
      initialBalance: balance ? balance : 0
    };

    if (balance) {

      project.balance = {
        [dateUtil.monthYearKey(new Date())]: {
          value: +balance
        }
      };
    }

    let unique = normalizeProjectName(name);
    const validateUniqueness = (name) => firebaseService.database.ref('projectsIdentifier/' + name).once('value');

    return util.whilePromise(validateUniqueness, unique, (res) => {
      const currentUnique = res.key;
      const isValid = res.val() === null;
      return {
        done: isValid,
        value: isValid ? currentUnique : generateProjectIdentifier(currentUnique)
      };
    }).then((unique) => {

      project.identifier = unique;
      return firebaseService.createProject(project);
    })

  },
  mergeProjectResults(projects, transactions, defaultCategories) {

    return projects.map(project => this.fillProject(project, transactions, defaultCategories))
  },
  fillProject(project, transactionsMap, defaultCategories) {

    let _project = transformToViewProject(project);

    const projectCategories = _project.categories.reverse().concat(defaultCategories);
    const projectTransactions = transactionsMap[_project.id] || [];

    return {
      ..._project,
      currency: util.searchInConst(CURRENCIES, _project.currency),
      transactions: projectTransactions,
      categories: projectCategories
    }
  },
  mergeProjectMembers(members, users) {
    const usersMap = util.toIdsMap(users);
    return members ? members.map(m => usersMap[m]) : [];
  },
  calculateProjectIndicators(project, transactions, budgets, selectedDate) {

    const monthlyBalance = transactionService.getTransactionsBalance(
      transactions
    );

    const budgetsUsage = budgetService.getBudgetsUsage(
      budgets
    );

    const projectBalance = project.balance;
    const projectBalanceRecords = projectBalance ? Object.keys(projectBalance) : [];

    const dateKey = dateUtil.monthYearKey(selectedDate);
    const totalBalance = projectBalanceRecords.reduce((total, balanceKey) => {

      if(dateUtil.beforeOrEqualBalanceKey(balanceKey, dateKey)) {
        total += +projectBalance[balanceKey].value;
      }

      return total;

    }, 0);

    return {
      monthlyBalance,
      budgetsUsage,
      totalBalance
    }
  },
  sendMemberInvite(project, currentUser, existingUser, inviteEmail) {

    //Creating notification for the invite user
    return notificationService.sendInviteNotification(
      project,
      currentUser,
      inviteEmail
    ).then(notification => {

      //Sending invite Email if user does not exists
      if (!existingUser && inviteEmail) {
        return request.post('sendInviteMail', {
          email: inviteEmail,
          owner: currentUser.displayName,
          project: project.name
        }).then(res => {

          return {
            ...res,
            notification: notification
          };
        })
      }

      return notification;
    });

  },
  updateProject(project, update) {

    return firebaseService.update(`/projects/${project.id}`, update);
  },
}

const transformToViewProject = (firebaseProject) => {

  let p = {...firebaseProject};

  p.categories = toArray(p.categories);
  p.budgets = toArray(p.budgets);
  p.customers = toArray(p.customers);
  p.events = toArray(p.events);
  p.members = p.members || [];

  const excludedCategories = p.excludedCategories || [];
  p.excludedCategories = Object.keys(excludedCategories).map(key => {
    return excludedCategories[key]
  });

  return p
};
const normalizeProjectName = name => name.toLowerCase().replaceAll(" ", "-");
const generateProjectIdentifier = name => `${normalizeProjectName(name)}-${util.randomAlphaNumeric(4)}`;
const toArray = (object) => object ? Object.keys(object).map(key => {
  return {
    id: key,
    ...object[key]
  }
}) : [];
