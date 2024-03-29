import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {config} from '../config/firebase';

import util from '@util/'

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth(), database = firebase.database();

export default {
  instance: firebase,
  auth,
  database,
  initUser(user) {
    this.user = user;
    user.getIdToken().then(token => this.token = token);
  },
  createUser(id, user) {
    return database.ref(`users/${id}`).set({
      user
    })
  },
  fetch(path) {

    return database.ref(path).once('value').then((snapshot) => {

      const fetchResult = {
        id: snapshot.key
      };

      const value = snapshot.val();
      if(!util.isObject(value)) {

        fetchResult.value = value;
        return fetchResult;
      }

      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    });
  },
  fetchArray(path) {

    return database.ref(path).once('value').then((snapshot) => {

        const value = snapshot.val();
        const keys = value ? Object.keys(value) : [];

        return keys.map(key => {

          return {
            id: key,
            ...value[key]
          }
        })
    });
  },
  fetchByKeys(path, keys = [], isArray = false) {

    let promises = [];
    keys.forEach(key => {

      promises.push(
        this[isArray ? 'fetchArray' : 'fetch'](`${path}/${key}`)
      );
    });

    return Promise.all(promises);
  },
  update(path, item) {
    return database.ref(path).update({
      ...item
    })
  },
  remove(path) {
    return database.ref(path).remove();
  },
  createProject(project) {

    return database.ref(`projects`).push(project)
      .then(res => {

        const projectKey = res.key;

        //Adding to user projects
        database.ref(`users/${project.owner}/projects/${projectKey}`).set(
          projectKey
        );

        //Adding to projects identifiers
        database.ref('projectsIdentifier/' + project.identifier).set(
          projectKey
        );

        return {
          ...project,
          id: projectKey
        }
      });
  },
  addUserProject(userId, projectId) {
    //Adding to user projects
    return database.ref(`users/${userId}/projects/${projectId}`).set(
      projectId
    );
  },
  createCategory(projectId, category) {

    return createProjectEntity(projectId, 'categories', category);
  },
  excludeCategory(projectId, categoryId) {

    return database.ref(`/projects/${projectId}/excludedCategories`).push(categoryId);
  },
  includeCategory(projectId, categoryId) {

    return database.ref(`/projects/${projectId}/excludedCategories`).orderByValue().equalTo(categoryId).once('value').then(snapshot => {

      const matched = snapshot.val();
      const key = Object.keys(matched)[0];

      return database.ref(`/projects/${projectId}/excludedCategories/${key}`).remove();
    })
  },
  createTransaction(projectId, dateKey, transaction) {

    return database.ref(`/transactions/${projectId}/${dateKey}`).push(transaction).then(res => {

      return {
        ...transaction,
        id: res.key
      }
    })
  },
  createBudget(projectId, budget) {

    return createProjectEntity(projectId, 'budgets', budget);
  },
  createCustomer(projectId, customer) {

    return createProjectEntity(projectId, 'customers', customer);
  },
  createEvent(projectId, event) {

    return createProjectEntity(projectId, 'events', event);
  },
  createNotification(email, notification) {

    return database.ref(`/notifications/${email}`).push(notification).then(res => {

      return {
        ...notification,
        id: res.key
      }
    })
  }
}

//Generic creation for project sub entities.
const createProjectEntity = (projectId, entityName, entity) => {

  return database.ref(`/projects/${projectId}/${entityName}`).push(entity).then(res => {

    return {
      ...entity,
      id: res.key
    }
  })
};
