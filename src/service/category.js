import firebaseService from './firebase';

export default {

  fetchDefaults: identifier => firebaseService.fetchArray(`/categories`),
  createCategory: (projectId, name, color, icon) => {

    const category = {
      name,
      color,
      icon
    };

    console.log("Creating: " + name);
    return firebaseService.createCategory(projectId, category)

  },
}
