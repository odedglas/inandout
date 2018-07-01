import firebaseService from './firebase';
import util from '@util/'

export default {

  fetchUserProjects: (projectKeys) => firebaseService.fetchByKeys('/projects', projectKeys).then(d => {

    return d.map( p => {

      //Flattening categories
      let categories = p.categories;
      if(categories){

        p.categories =  Object.keys(p.categories).map(key =>{
          return {
            id:key,
            ...categories[key]
          }
        });
      }
      return p;
    });

  }),
  fetchProject: identifier => firebaseService.fetch(`/projectsIdentifier/${identifier}`).then(res => {
    return  firebaseService.fetch(`/projects/${res.value}`);
  }),
  createProject: (name, type, description) => {

    const project = {
      name,
      type,
      description,
      owner: firebaseService.user.id,
      isNew: true,
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