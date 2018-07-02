import firebaseService from './firebase';
import util from '@util/'

export default {

  fetchUserProjects: (projectKeys) => firebaseService.fetchByKeys('/projects', projectKeys).then(projects => {

    return projects.map(p => {

      //Flattening categories
      const categories =  p.categories || [];
      p.categories = Object.keys(categories).map(key => {
        return {
          id: key,
          ...categories[key]
        }
      });

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
}
const normalizeProjectName = name => name.toLowerCase().replaceAll(" ", "-");
const generateProjectIdentifier = name => `${normalizeProjectName(name)}-${util.randomAlphaNumeric(4)}`;