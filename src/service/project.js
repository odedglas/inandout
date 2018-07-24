import firebaseService from './firebase';
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
  mergeProjectResults: (projects, transactions, defaultCategories) => {

    return projects.map(project => {

      const customers = project.customers || [];
      const members = project.members || [];
      const budgets = project.budgets || [];
      const projectCategories = project.categories.reverse().concat(defaultCategories);
      const projectTransactions = transactions[project.id];

      return {
        ...project,
        currency: util.searchInConst(CURRENCIES,project.currency),
        customers,
        members,
        budgets,
        transactions: projectTransactions,
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
