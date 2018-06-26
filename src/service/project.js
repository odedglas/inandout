import firebaseService from './firebase';
import util from '@util/'

export default {

  fetchUserProjects: (projectKeys) => firebaseService.fetchByKeys('/projects', projectKeys),
  fetchProject: id => firebaseService.fetch(`/projects/${id}`).then(res => {
    return {id: res.id, ...res.project}
  }),
  createProject: (name, type, description) => {

    const project = {
      name,
      type,
      description,
      owner: firebaseService.user.id
    };

    let unique = name;
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

const generateProjectIdentifier = name => `${name.toLowerCase().replaceAll(" ", "").replaceAll("-", "")}-${util.randomAlphaNumeric(4)}`;