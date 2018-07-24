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
  auth,
  database,
  initUser(user) {
    this.user = user;
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
  fetchByKeys(path, keys, isArray) {

    let promises = [];
    keys.forEach(key => {

      promises.push(
        this[isArray ? 'fetchArray' : 'fetch'](`${path}/${key}`)
      );
    });

    return Promise.all(promises);
  },
  update(path, item) {
    return database.ref(path).set({
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
        database.ref(`users/${project.owner}/projects`).push(
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
  createCategory(projectId, category) {

    return database.ref(`/projects/${projectId}/categories`).push(category).then(res => {

      return {
        ...category,
        id: res.key
      }
    })
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

    return database.ref(`/projects/${projectId}/budgets`).push(budget).then(res => {

      return {
        ...budget,
        id: res.key
      }
    })
  },
}
