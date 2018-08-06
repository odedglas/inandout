import firebaseService from './firebase';
import transactionService from './transaction';
import budgetSerivce from './budget';
import util from '@util/'
import {CURRENCIES} from "@const/";

export default {
  fetchUserProjects(projectKeys) {

    return firebaseService.fetchByKeys('/projects', projectKeys);
  },
  fetchProject(identifier) {
    firebaseService.fetch(`/projectsIdentifier/${identifier}`).then(res => {
      return firebaseService.fetch(`/projects/${res.value}`);
    })
  },
  createProject(name, type, description, currency, balance) {

    const ownerId = firebaseService.user.uid;

    const project = {
      name,
      type,
      description,
      currency,
      balance,
      members: [ownerId],
      owner: ownerId,
    };

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
  calculateProjectIndicators(project, transactions, budgets) {

    const monthlyBalance = transactionService.getTransactionsBalance(
      transactions
    );

    const budgetsUsage = budgetSerivce.getBudgetsUsage(
      budgets,
      transactions
    );

    return {
      monthlyBalance,
      budgetsUsage
    }
  }
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
