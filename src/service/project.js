import firebaseService from './firebase';
import budgetSerivce from './budget';
import transactionService from './transaction';

import util from '@util/'
import {CURRENCIES} from "@const/";

export default {

  fetchUserProjects: (projectKeys) => firebaseService.fetchByKeys('/projects', projectKeys).then(projects => {

    return projects.map(p => {

      p.categories = toArray(p.categories);
      p.budgets = toArray(p.budgets);

      const excludedCategories = p.excludedCategories || [];
      p.excludedCategories = Object.keys(excludedCategories).map(key => {
        return excludedCategories[key]
      });

      return p;
    });

  }),
  fetchProject: identifier => firebaseService.fetch(`/projectsIdentifier/${identifier}`).then(res => {
    return firebaseService.fetch(`/projects/${res.value}`);
  }),
  createProject: (name, type, description, currency) => {

    const project = {
      name,
      type,
      description,
      currency,
      owner: firebaseService.user.id,
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
  mergeProjectResults: (projects, transactions, defaultCategories, users) => {

    const usersMap = util.toIdsMap(users);

    return projects.map(project => {

      const categories = filterExcluded(
        defaultCategories,
        project.excludedCategories
      );

      const customers = project.customers || [];
      const members = project.members || [];
      const budgets = project.budgets || [];
      const projectTransactions = transactionService.mergeTransactions(transactions[project.id], customers, categories, users);
      const projectCategories = project.categories.reverse().concat(categories);

      return {
        ...project,
        owner: usersMap[project.owner],
        currency: util.searchInConst(CURRENCIES,project.currency),
        customers,
        members: members.map(m => usersMap[m.id]),
        transactions: projectTransactions,
        budgets: budgetSerivce.mergeBudgets(budgets, projectCategories, projectTransactions),
        categories: projectCategories
      }
    })
  }
}
const normalizeProjectName = name => name.toLowerCase().replaceAll(" ", "-");
const generateProjectIdentifier = name => `${normalizeProjectName(name)}-${util.randomAlphaNumeric(4)}`;
const toArray = (object) => object ? Object.keys(object).map(key => {
  return {
    id: key,
    ...object[key]
  }
}) : [];
const filterExcluded = (categories, excluded) => {
  excluded = Array.isArray(excluded) ? excluded : (excluded ? [excluded] : []);
  return categories.filter(c => excluded.indexOf(c.id) === -1);
};