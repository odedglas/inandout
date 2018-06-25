import firebaseService from './firebase';

export default {

  fetchProject: id => firebaseService.fetch(`/projects/${id}`).then(res =>  {
    return {id: res.id, ...res.project}
  }),
  createProject: (name, type, description) => {

    const project =  {
      name,
      type,
      description,
    };

    return firebaseService.createProject(project);
  },
}
