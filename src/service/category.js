import firebaseService from './firebase';

export default {

  fetchDefaults: identifier => firebaseService.fetchArray(`/categories`),
  createCategory: (projectId, name, icon, color) => {

    const category = {
      name,
      color,
      icon
    };
    return firebaseService.createCategory(projectId, category)

  },
}
