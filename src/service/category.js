import firebaseService from './firebase';

export default {

  fetchDefaults: identifier => firebaseService.fetchArray(`/categories`),
  CreateCategory: (name, color, icon) => {

    const category = {
      name,
      color,
      icon
    };

  },
}
