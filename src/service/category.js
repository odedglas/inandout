import firebaseService from './firebase';

export default {

  fetchDefaults: identifier => firebaseService.fetchArray(`/categories`),
  createCategory: (projectId, name, icon, color) => {

    const category = {
      name,
      color,
      icon,
      isCustom: true,
    };
    return firebaseService.createCategory(projectId, category)

  },
  editCategory: (projectId, categoryId, name, icon, color) => {

    const category = {
      name,
      color,
      icon,
      isCustom: true,
    };

    const updatePath = categoryPath(projectId, categoryId);

    return firebaseService.update(updatePath, category).then(() => {
      category.id = categoryId;
      return category;
    });
  },
  excludeCategory: (projectId, categoryId) => {

    return firebaseService.excludeCategory(projectId, categoryId);
  },
  includeCategory: (projectId, categoryId) => {

    return firebaseService.includeCategory(projectId, categoryId);
  }
}

const categoryPath = (projectId, categoryId) => `/projects/${projectId}/categories/${categoryId}`;
