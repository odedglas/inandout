import firebaseService from './firebase';

export default {

  fetchCurrentUserProjects: () => {
    const userProjectKeys = firebaseService.user.projects;

    return firebaseService.fetchByKeys('/projects', userProjectKeys);
  },
  fetchProject: id => firebaseService.fetch(`/projects/${id}`).then(res => {
    return {id: res.id, ...res.project}
  }),
  createProject: (name, type, description) => {

    const project = {
      name,
      type,
      description,
    };

    return firebaseService.createProject(project);
  },
}
